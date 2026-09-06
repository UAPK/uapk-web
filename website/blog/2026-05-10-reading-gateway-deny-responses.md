---
slug: reading-gateway-deny-responses
title: "How to Read a Gateway Deny Response"
authors: [davidsanker]
tags: [uapk-gateway, policy-enforcement, ai-governance, audit-logging, compiler]
date: 2026-05-10
description: "The gateway returns specific reason codes for every deny and escalate decision. Here's what each code means, why it fires, and how to fix it."
---

The UAPK gateway returns structured responses for every evaluation. A `DENY` or `ESCALATE` response includes a reason code that tells you exactly which policy check failed and why. If you're building an integration and getting unexpected denies, this post is your reference.

<!-- truncate -->

## Response Structure

Every evaluate and execute response follows this shape:

```json
{
  "decision": "ALLOW" | "DENY" | "ESCALATE",
  "reason_code": "string | null",
  "reason": "Human-readable explanation",
  "interaction_id": "int_abc123",
  "approval_id": "apr_xyz | null",
  "timestamp": "2026-05-10T12:00:00Z"
}
```

`reason_code` is null on ALLOW decisions. On DENY and ESCALATE, it contains the machine-readable code. `reason` is the human-readable explanation suitable for logging.

For ESCALATE decisions, `approval_id` contains the ID of the created approval record. The approver uses this ID to approve or reject the action; you use it to retrieve an override token after approval.

## The Policy Check Sequence

The gateway runs 10 checks in order and returns at the first failure:

```
1. MANIFEST_NOT_FOUND / MANIFEST_INACTIVE
2. TOKEN_EXPIRED / TOKEN_MAX_ACTIONS_EXCEEDED / TOKEN_CAPABILITY_NOT_GRANTED / TOKEN_REVOKED / CAPABILITY_TOKEN_REQUIRED
3. OVERRIDE_TOKEN_ALREADY_USED / OVERRIDE_TOKEN_EXPIRED / OVERRIDE_TOKEN_HASH_MISMATCH
4. ACTION_TYPE_DENIED / ACTION_TYPE_NOT_IN_MANIFEST
5. TOOL_NOT_IN_ALLOWLIST
6. AMOUNT_EXCEEDS_CAP
7. JURISDICTION_NOT_ALLOWED
8. COUNTERPARTY_IN_DENYLIST / COUNTERPARTY_NOT_IN_ALLOWLIST
9. DAILY_BUDGET_EXCEEDED / ACTION_TYPE_BUDGET_EXCEEDED
10. RATE_LIMIT_EXCEEDED
```

If check 7 fires, checks 8–10 were never evaluated. This ordering matters for debugging: always fix errors from the top down.

## Reason Codes Reference

### Manifest Errors (Check 1)

**`MANIFEST_NOT_FOUND`**
The `uapk_id` in your request doesn't exist in the gateway. Verify the ID you're using matches what was returned at registration.

**`MANIFEST_INACTIVE`**
The manifest exists but its status is not `ACTIVE`. It may be `SUSPENDED` or `REVOKED`. Check manifest status via `GET /api/v1/manifests/{uapk_id}`.

---

### Capability Token Errors (Check 2)

**`CAPABILITY_TOKEN_REQUIRED`**
The manifest has `require_capability_token: true` and no token was provided in the request. Issue a capability token and include it in the `capability_token` field.

**`TOKEN_EXPIRED`**
The token's `expires_at` timestamp is in the past. Issue a new token.

**`TOKEN_MAX_ACTIONS_EXCEEDED`**
The token has used all of its allocated `max_actions`. Issue a new token with a higher action limit, or issue a new token for the next session.

**`TOKEN_CAPABILITY_NOT_GRANTED`**
The token's capability list doesn't include the capability needed for the requested `action_type`. Example: the token has `["data:read"]` but the request is for `recommendation:generate`. Issue a token that includes the required capability.

**`TOKEN_REVOKED`**
The token was revoked before use. Issue a new token.

**`TOKEN_TYPE_MISMATCH`**
A token of the wrong type was submitted (e.g., an override token in the `capability_token` field). Use the correct field for each token type.

---

### Override Token Errors (Check 3)

**`OVERRIDE_TOKEN_ALREADY_USED`**
Override tokens are single-use. This token was already consumed by a prior request. If the prior request failed after the token was consumed, the action failed — you need a new approval cycle.

**`OVERRIDE_TOKEN_EXPIRED`**
Override tokens have a validity window (typically 1 hour after issuance). The window has passed. Re-submit the original action to generate a new escalation, and have the approver re-approve.

**`OVERRIDE_TOKEN_HASH_MISMATCH`**
The override token was issued for a specific action payload (identified by SHA-256 hash). The current request's payload doesn't match what the approver approved. Do not modify the request parameters between approval and execution.

---

### Policy Rule Errors (Check 4)

**`ACTION_TYPE_DENIED`**
An explicit deny rule in the manifest matches this action type. Check the manifest's policy rules section for deny patterns that match your action type.

**`ACTION_TYPE_NOT_IN_MANIFEST`**
The action type is not declared in `capabilities.requested`. Add it to the manifest and re-register, or change the request to use a declared action type.

---

### Tool Errors (Check 5)

**`TOOL_NOT_IN_ALLOWLIST`**
The tool requested is not in the manifest's `tool_allowlist`. Options:
1. Add the tool to the allowlist and update the manifest
2. Add the tool to the `tools` section and the `tool_allowlist`
3. Use a tool that's already in the allowlist

Note: if the `tool_allowlist` is omitted from the manifest, all tools are allowed. The deny fires when a non-empty allowlist is specified and the tool is absent.

---

### Amount Errors (Check 6)

**`AMOUNT_EXCEEDS_CAP`**
The `amount` in the request params exceeds the manifest's amount cap for this action type. Options:
1. Split the transaction into amounts under the cap
2. Increase the amount cap in the manifest
3. Use `require_human_approval` + `approval_thresholds` for amounts above a threshold instead of a hard cap

Amount caps are in `policy.amount_caps` (per-action-type) or `policy.global_amount_cap` (applies to all actions).

---

### Jurisdiction Errors (Check 7)

**`JURISDICTION_NOT_ALLOWED`**
The `jurisdiction` field in the request is not in the manifest's `jurisdiction_allowlist`. The agent is restricted to specific geographic markets.

If you're testing with no jurisdiction field, some implementations default to a value not in your allowlist. Always explicitly pass the `jurisdiction` field.

---

### Counterparty Errors (Check 8)

**`COUNTERPARTY_IN_DENYLIST`**
The counterparty in the request matches an entry in `policy.counterparty_denylist`. This is typically an OFAC SDN list match or a fraud denylist entry. Do not attempt to circumvent this check.

**`COUNTERPARTY_NOT_IN_ALLOWLIST`**
The manifest has a non-empty `counterparty_allowlist` and the counterparty is not in it. This is used for healthcare agents (must have a BAA with the counterparty), regulated financial agents (pre-approved counterparty lists), or any scenario where the agent should only interact with vetted parties.

To add a counterparty: update the manifest's `counterparty_allowlist`, re-register, and reactivate.

---

### Budget Errors (Check 9)

**`DAILY_BUDGET_EXCEEDED`**
The agent has exhausted its daily action budget (total across all action types). The budget resets at midnight UTC. If you're regularly hitting the daily budget, increase it in the manifest or implement request queuing.

**`ACTION_TYPE_BUDGET_EXCEEDED`**
The agent has exhausted its per-action-type daily budget for this specific action type. Check `constraints.per_action_type_budgets` in the manifest. Same options as daily budget.

---

### Rate Limit Errors (Check 10)

**`RATE_LIMIT_EXCEEDED`**
The request rate exceeds the gateway's per-manifest rate limit: 120 evaluate requests/minute, 60 execute requests/minute. These are not configurable in the manifest — they're gateway-level protections.

Implement exponential backoff with jitter. If your legitimate use case requires higher throughput, the enterprise plan supports higher rate limits.

---

## Escalate vs. Deny

**`ESCALATE`** means the action is not automatically allowed but *can* be approved. The gateway creates an approval record. An approver reviews and either approves (generating an override token) or rejects.

**`DENY`** means the action cannot proceed regardless of human review. The policy rule is absolute.

`require_human_approval` on an action type produces ESCALATE. Counterparty denylists, jurisdiction restrictions, and amount caps produce DENY.

An ESCALATE that the approver rejects becomes an effective DENY — but the distinction matters for audit purposes. An ESCALATE records the approver's decision; a DENY records the policy check that fired.

## Debugging Checklist

When you get an unexpected deny:

1. Check the `reason_code` — it identifies the exact check that failed
2. Verify the request payload — is `jurisdiction`, `counterparty`, `amount`, and `tool` populated correctly?
3. Check the manifest — is the action type declared in `capabilities.requested`? Is the tool in `tool_allowlist`? Is the jurisdiction in `jurisdiction_allowlist`?
4. Check the capability token — is it unexpired? Does it have actions remaining? Does it include the required capability?
5. Check the audit log record for this `interaction_id` — the full evaluation context is stored there

The `interaction_id` returned in every response (including denies) is the primary key for finding the record in the audit log. Even denied requests are recorded — the log contains the complete decision history, not just successful actions.
