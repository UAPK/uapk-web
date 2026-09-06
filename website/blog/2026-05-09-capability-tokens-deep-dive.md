---
slug: capability-tokens-deep-dive
title: "Capability Tokens: How UAPK Scopes Agent Permissions per Session"
authors: [davidsanker]
tags: [uapk-gateway, ai-governance, policy-enforcement, audit-logging, compiler]
date: 2026-05-09
description: "Capability tokens are signed credentials that scope an AI agent's permissions to a specific session, task, or time window. They sit between the manifest (lifetime policy) and the individual request (single action). Here's how they work and when to use them."
---

The manifest defines what an AI agent is *allowed* to do over its entire deployed lifetime. That's too coarse for most real deployments. You want the agent to be able to read customer data when it's responding to a customer query — but not when it's running a batch analytics task. You want different agents deployed with the same manifest to have different effective permissions depending on what task they're executing.

Capability tokens solve this. They are signed credentials — issued per session or per task — that scope the agent's permissions to a subset of its manifest-defined capabilities, for a specific time window, with a maximum action count.

<!-- truncate -->

## The Three-Layer Permission Model

UAPK uses three layers of permission:

```
Manifest (lifetime policy)
    ↓ narrows to
Capability Token (session policy)
    ↓ applied to
Individual Request (single action evaluation)
```

The manifest sets the ceiling. The capability token sets the operational scope within that ceiling. An individual request is evaluated against both.

A manifest that allows `["data:read", "data:write", "recommendation:generate", "payment:execute"]` can issue a capability token scoped to `["data:read"]` only. Any request using that token for `data:write` will be denied regardless of what the manifest allows.

## Token Structure

A capability token is an Ed25519-signed JSON payload:

```json
{
  "token_type": "capability",
  "uapk_id": "my-saas-agent-abc123",
  "capabilities": ["data:read", "recommendation:generate"],
  "issued_at": 1746700800,
  "expires_at": 1746704400,
  "max_actions": 50,
  "issued_to": "session-user-12345",
  "session_id": "sess_xyz"
}
```

The `token_type: "capability"` field is required — it prevents substitution attacks where an override token (a different type, used to re-submit escalated actions) is submitted in a context expecting a capability token. The gateway rejects tokens with the wrong type.

**Fields:**

- `capabilities`: the allowed capability set for this token — must be a subset of the manifest's `capabilities.requested`
- `expires_at`: Unix timestamp; token is invalid after this time
- `max_actions`: maximum number of gateway evaluations this token can be used for; decremented on each use
- `issued_to`: human-readable identity of who/what received this token (for audit log attribution)
- `session_id`: optional identifier to group related interactions in the audit log

## Issuing Tokens

```bash
# Short-lived token for a customer query session
curl -X POST "$BASE_URL/api/v1/capabilities" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "uapk_id": "my-saas-agent-abc123",
    "capabilities": ["data:read", "recommendation:generate"],
    "expires_in_seconds": 1800,
    "max_actions": 20,
    "issued_to": "customer-session-user42",
    "session_id": "sess_customer_query_20260509"
  }'
```

For a batch analytics task with different scope:

```bash
curl -X POST "$BASE_URL/api/v1/capabilities" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "uapk_id": "my-saas-agent-abc123",
    "capabilities": ["data:read"],
    "expires_in_seconds": 7200,
    "max_actions": 10000,
    "issued_to": "batch-analytics-service",
    "session_id": "batch_daily_20260509"
  }'
```

The same agent, the same manifest, but two tokens with different scopes. The analytics batch can make 10,000 read calls in two hours. The customer session can make 20 calls (read + recommendation) in 30 minutes. Neither can escalate their scope without a new token.

## When Tokens Are Required

`require_capability_token: true` in the manifest policy means that every request to the gateway must include a valid capability token. Requests without a token are denied with `CAPABILITY_TOKEN_REQUIRED`.

This is the recommended setting for any production deployment. It forces explicit token issuance per session or task — which means there's always a `issued_to` attribution in the audit record, and expired or revoked tokens can't be reused.

`require_capability_token: false` is appropriate for development environments or simple single-use deployments where session scoping isn't needed.

## Token Validation: What the Gateway Checks

When the gateway receives a request with a capability token, it checks in sequence:

1. **Signature valid**: Ed25519 signature over the token payload verifies correctly against the gateway's public key
2. **token_type == "capability"**: rejects override tokens submitted as capability tokens
3. **Not expired**: `expires_at > now()`
4. **max_actions not exhausted**: token's remaining action count > 0
5. **Capability match**: the request's `action_type` is covered by one of the token's declared capabilities (fnmatch glob matching — `data:*` covers `data:read` and `data:write`)

If any check fails, the gateway returns `DENY` with the specific reason code: `TOKEN_EXPIRED`, `TOKEN_MAX_ACTIONS_EXCEEDED`, `TOKEN_CAPABILITY_NOT_GRANTED`, etc.

After a valid evaluation, the gateway decrements the token's remaining action count in Redis. If `max_actions` was 20 and this is the 20th use, the next request with the same token will return `TOKEN_MAX_ACTIONS_EXCEEDED`.

## Capability Glob Matching

Capabilities use colon-separated namespaces with fnmatch glob support:

| Token capability | Matches | Doesn't match |
|-----------------|---------|---------------|
| `data:read` | `data:read` | `data:write`, `data:*` |
| `data:*` | `data:read`, `data:write`, `data:delete` | `recommendation:generate` |
| `*:read` | `data:read`, `config:read`, `profile:read` | `data:write` |

Wildcard tokens (`*:*`) should never be issued in production. They negate the scoping purpose of the token layer. The qualification funnel's framework evidence requirements and most compliance frameworks require that credentials be scoped to least-privilege — `*:*` violates least-privilege by definition.

## Token Revocation

Tokens can be revoked before their expiry:

```bash
curl -X DELETE "$BASE_URL/api/v1/capabilities/{token_id}" \
  -H "X-API-Key: $API_KEY"
```

Revoked tokens are marked in Redis. Subsequent requests using the revoked token return `TOKEN_REVOKED`. Revocation is reflected in the audit log — the record shows that the token was revoked at a specific time, which is useful for incident investigation.

## Token Lifecycle in the Audit Log

Every interaction record includes:

```json
{
  "interaction_id": "int_abc123",
  "uapk_id": "my-saas-agent-abc123",
  "capability_token_id": "cap_xyz789",
  "issued_to": "customer-session-user42",
  "session_id": "sess_customer_query_20260509",
  "action_type": "recommendation:generate",
  "decision": "ESCALATE",
  "timestamp": "2026-05-09T14:23:11Z"
}
```

The `capability_token_id` and `issued_to` fields link every interaction to its token. For a compliance audit: "show me every action taken by this customer-facing session" is a query on `issued_to`. "Show me every action taken during this analytics batch" is a query on `session_id`. "Show me when this token was last used before it expired" is a query on `capability_token_id`.

## Practical Pattern: Principle of Least Privilege

Issue tokens with the minimum capabilities required for the task. Never reuse tokens across unrelated sessions. Let tokens expire naturally — don't revoke them unless there's a security reason to do so early.

For customer-facing workflows: issue a token per user session, scoped to the capabilities that session requires. A support session needs `data:read`. A recommendation session needs `data:read + recommendation:generate`. A payment session needs `payment:query`. Issue separately; don't combine unless the task requires it.

For internal workflows: issue a token per job execution, scoped to what that job reads and writes. The batch job that reads customer data for analytics gets a `data:read`-only token with a max_actions limit corresponding to the expected batch size. If the job is compromised and tries to write data, the token scope prevents it.

This is the capability token's core security value: it limits blast radius. A compromised session can only do what its token allows, not what the manifest allows. The manifest is the upper bound; the token is the operational bound.
