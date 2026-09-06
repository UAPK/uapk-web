---
slug: ai-agent-governance-make-zapier-n8n
title: "AI Agent Governance for Make.com, Zapier, and n8n: How to Enforce Policy and Keep Audit Trails"
authors: [davidsanker]
tags: [make, zapier, n8n, integrations, compliance, audit]
description: "How to add non-bypassable policy enforcement, human approval gates, and tamper-evident audit logs to AI automations built on Make.com, Zapier, or n8n."
---

Automation platforms like Make.com, Zapier, and n8n have made it easy to build AI-powered workflows. But "easy to build" doesn't mean "safe to deploy in production" — especially when those workflows take real-world actions: sending emails, filing documents, moving money, or updating records.

This post shows how to wire UAPK Gateway into any automation platform to get:

- **Policy enforcement** (ALLOW / DENY / ESCALATE before any action runs)
- **Human approval gates** (escalated actions wait for a real person)
- **Tamper-evident audit logs** (hash-chained, cryptographically signed records)

<!-- truncate -->

## Why You Need Governance Beyond What Automation Platforms Provide

Make, Zapier, and n8n give you logs. They don't give you governance.

**Logs** tell you what happened. **Governance** decides what's *allowed to happen* and stops it if not.

The difference matters when:

- A compliance team asks "who authorized this?" — not just "when did it run?"
- A regulator asks for evidence a human reviewed high-risk actions before execution
- A developer makes a mistake in a workflow and you need to know the $50K transfer was blocked, not just that the step errored
- You're in a regulated industry (legal, finance, healthcare) where "the AI did it" is not a defense

UAPK Gateway is a sidecar that sits between your automation and the outside world. Every action goes through it first.

## The Pattern: Evaluate → Branch → Execute

The integration pattern is the same regardless of platform:

```
Trigger → Build action payload → UAPK Evaluate → Branch on decision:
  allow   → Execute action → Log result
  deny    → Stop / notify
  escalate → Notify reviewer → Wait for approval → Re-submit with override token
```

The `evaluate` call is a dry run — no side effects, instant policy check. The `execute` call does the same check plus runs the action.

## Make.com

UAPK Gateway has a native Make.com custom app with 8 modules.

**Install:** Import the app JSON from [github.com/UAPK/gateway](https://github.com/UAPK/gateway) → `sdks/make/app.json` into your Make.com team.

**Connection fields:**
- Base URL: `https://api.uapk.info`
- Organization ID: from your dashboard
- API Key: from your dashboard
- Management Token: JWT from `POST /auth/login` (for approvals)

**Sample scenario — email governance:**

1. **Gmail Trigger** → new email matching criteria
2. **UAPK: Execute Action**
   - UAPK ID: `email-agent`
   - Action Type: `send_email`
   - Tool: `email:send`
   - Params: `{"to": "{{email.from}}", "subject": "...", "amount": null}`
3. **Router** → branch on `decision`
   - `allow` → **Gmail: Send Message**
   - `deny` → **Slack: Post Message** (notify team of denial)
   - `escalate` → **Slack: Post Message** with `approval_id`, wait for manual step, then re-submit with override token

The key: the email doesn't send unless UAPK says `allow`. If the recipient is on a denylist, or the daily email budget is exceeded, it's blocked — automatically, without code changes.

## Zapier

The UAPK Gateway Zapier app is published as a private integration (request access at `mail@uapk.info`).

It includes 4 creates and 3 searches:
- **Creates:** Evaluate Action, Execute Action, Approve Action, Deny Action
- **Searches:** Find Approval, List Pending Approvals, Find Audit Records

**Sample Zap — financial workflow:**

1. **Trigger:** Typeform submission (payment request)
2. **UAPK: Evaluate Action** — check if amount is within policy
3. **Filter:** Only continue if `decision = allow`
4. **Stripe: Create Payment Intent** — only runs after UAPK approval

For escalated actions (amount above threshold), a separate Zap handles the approval workflow:

1. **Trigger:** Schedule (every 15 min) or webhook
2. **UAPK: Find Pending Approvals**
3. **Filter:** Has pending approvals
4. **Gmail: Send Email** — alert reviewer
5. **UAPK: Approve Action** — after manual confirmation step
6. Returns `override_token` for the agent to re-submit

## n8n

The UAPK Gateway n8n node is published to npm as `n8n-nodes-uapk-gateway`.

**Install:** In your n8n instance → Settings → Community Nodes → `n8n-nodes-uapk-gateway`

The n8n node has a distinctive feature: **three output pins** — Allow, Deny, Escalate. This maps naturally to n8n's visual workflow branching.

```
[HTTP Request: webhook] → [UAPK Gateway: Execute]
                                    │
              ┌─────────────────────┼────────────────────────┐
           Allow                  Deny                  Escalate
              │                    │                        │
    [Postgres: Insert]     [Slack: notify]     [Email: alert reviewer]
```

Each output pin routes to a completely separate branch of your workflow. No extra router nodes, no conditional expressions to write.

**Available operations:**
- Gateway: Evaluate, Execute
- Approval: Get, Approve, Deny, List Pending
- Records: List, Verify Integrity

## Langflow

For AI-native workflows built in Langflow, install the `uapk-langflow` PyPI package:

```bash
pip install uapk-langflow
```

Eight components appear in your Langflow sidebar under "UAPK Gateway":

- **Evaluate Action** — policy dry-run, connect to Conditional Router
- **Execute Action** — policy + execution, routes to Allow/Escalate branches
- **Approve / Deny Action** — HITL decision nodes
- **Get Approval / List Pending Approvals** — approval status queries
- **List Records / Verify Integrity** — audit log access

The Langflow pattern is ideal for RAG pipelines where the agent reads documents and then needs to take regulated actions (file a brief, send a contract, initiate a payment). The Evaluate component gives compliance a checkpoint without breaking the flow.

## What Goes in the Audit Log

Every action that passes through UAPK Gateway generates a tamper-evident record:

```json
{
  "record_id": "int-abc123",
  "uapk_id": "email-agent",
  "agent_id": "make-scenario-001",
  "action_type": "send_email",
  "tool": "email:send",
  "decision": "allow",
  "decision_reason": "All policy checks passed",
  "record_hash": "sha256:...",
  "previous_record_hash": "sha256:...",
  "gateway_signature": "ed25519:...",
  "created_at": "2026-03-28T..."
}
```

Each record includes:
- The action details and policy decision
- A SHA-256 hash of this record
- The previous record's hash (hash chain — tampering is detectable)
- An Ed25519 signature from the gateway

You can verify the entire chain with a single API call:

```bash
GET /api/v1/orgs/{org_id}/records/verify/integrity
# → { "valid": true, "record_count": 1842, "errors": [] }
```

This is what "court-admissible audit log" means in practice: not just logs, but cryptographically verified, hash-chained, independently verifiable records that you own and control.

## Getting Started

1. **Start the manifest builder** at [build.uapk.info](https://build.uapk.info) — create your first agent manifest in under 5 minutes
2. **Get your API key** from the UAPK dashboard
3. **Follow the integration guide** for your platform:
   - [Make.com →](/docs/integrations/make)
   - [Zapier →](/docs/integrations/zapier)
   - [n8n →](/docs/integrations/n8n)
   - [Langflow →](/docs/integrations/langflow)

Or [contact us](mailto:mail@uapk.info) if you want a pilot on your infrastructure with expert setup included.
