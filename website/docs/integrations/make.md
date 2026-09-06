---
sidebar_position: 2
title: Make.com
description: Automate UAPK Gateway policy enforcement and approval workflows with Make.com
---

# Make.com Integration

Connect UAPK Gateway to Make.com (formerly Integromat) to build visual automation scenarios that enforce AI agent policies, route human approvals, and export audit logs — all with a no-code drag-and-drop interface.

Every agent action routed through a Make.com scenario flows through the Gateway: evaluated against your UAPK manifest (policy rules, tool allowlist, budgets, approval thresholds), optionally executed, and recorded in a cryptographically signed hash chain. Escalated actions wait for human approval; the approval returns a single-use override token that lets the agent re-submit.

---

## When to use this app

Use it in any Make.com scenario that produces or proxies an autonomous agent action and needs one or more of:

- **Policy enforcement** — block out-of-policy actions before they execute
- **Human-in-the-loop approvals** — route high-value or high-risk actions to a reviewer
- **Tamper-evident audit trail** — sign every decision, hash-chain every record, detect tampering
- **LLM output governance** — forward raw ChatGPT/Claude JSON and let the Gateway extract action type, tool, amount, and counterparty itself

---

## Install

The UAPK Gateway Make.com app is currently in private preview. Request access through the invite link, then use it like any other Make.com app.

1. Email [support@uapk.info](mailto:support@uapk.info) with the subject **"Make.com app invite"**. You'll receive a one-click invite link of the form `https://apps.make.com/uapk-gateway-<suffix>`.
2. Open the invite link while signed in to Make.com. The app is added to your organization.
3. In any new scenario, search for **UAPK Gateway** in the module picker.

Once the app passes Make Partner Program review it will be listed publicly.

---

## Connection

Three fields in the connection dialog:

| Field | Value |
|-------|-------|
| **API Base URL** | `https://api.uapk.info` (hosted) or your self-hosted URL |
| **Organization ID** | Your org UUID from the Gateway dashboard |
| **API Key** | A single API key covering all 13 modules (Gateway, approvals, audit) |

One API key is enough — there is no separate management token. Create one under **API Keys** in your Gateway dashboard; copy your Organization ID from the same page.

The connection is validated against an authenticated endpoint on save — a wrong org ID or a wrong key will fail immediately with `401` or `403`.

---

## The 13 modules

Grouped by workflow. Every module authenticates with `X-API-Key` and is scoped to your organization.

### Gateway evaluation and execution

| Module | Purpose |
|--------|---------|
| **Evaluate Action** | Dry-run a specific action. Returns `allow`, `deny`, or `escalate` plus reason codes. No side effects. Use for pre-flight checks. |
| **Execute Action** | Policy check **and** fire the tool connector. Returns the same decision plus `executed`, `result.success`, and `result.data`. Use this for the real call. |
| **Evaluate Agent Decision** | Same as Evaluate Action, but takes raw LLM output (JSON or text). The Gateway auto-extracts `action_type`, `tool`, `amount`, `counterparty` from the JSON. Ideal when the upstream module is a ChatGPT/Claude block. |

All three use cascaded dropdowns: pick your UAPK manifest, and Make.com fetches the manifest's declared action types and tool allowlist from the Gateway. You can only select combinations that exist in the manifest.

### Human approval workflow

| Module | Purpose |
|--------|---------|
| **List Pending Approvals** | Return every approval awaiting a decision. Expired items are auto-marked on read. |
| **Get Approval** | Fetch one approval by `approval_id`, including the full action payload, counterparty, status, and decision metadata. |
| **Approve Action** | Mark an approval as approved. Returns a single-use **override token** (Ed25519-signed JWT) bound to the action's hash. The agent uses that token in its next Execute Action call to bypass the escalation. Default token lifetime is 3600 seconds (configurable 60–3600). |
| **Deny Action** | Mark an approval as denied. Optional `reason` (short code, e.g. `policy_violation`) and free-form `notes` (up to 1000 chars). No token is issued. |

### Audit log

| Module | Purpose |
|--------|---------|
| **List Audit Records** | Search records with filters: `agent_id`, `action`, `decision`, time range, limit, offset. Returns lightweight rows (id, decision, timestamp, record hash). |
| **Get Audit Record** | Fetch one record in full: request/response payloads, Ed25519 gateway signature, previous-record hash, full policy trace, risk snapshot. The forensic view. |
| **Verify Audit Chain Integrity** | Walk the entire hash chain and verify every signature and link. Returns `valid: true/false`, `record_count`, `uapks_verified`, `errors[]`. **If this ever returns `valid: false`, stop — the audit log has been tampered with.** |

### Search filters

| Module | Purpose |
|--------|---------|
| **List Approvals** | Approvals with filters: status (`pending` / `approved` / `denied` / `expired`), UAPK ID, time range. For reporting and dashboards beyond just pending. |

### Polling triggers

| Module | Purpose |
|--------|---------|
| **Watch New Pending Approvals** | Fires once per new escalation. Use as the trigger of a scenario that notifies reviewers (Slack, email, Teams, mobile push). |
| **Watch Approval Decisions** | Fires once per decided approval (approved or denied). Use as the trigger of a scenario that resubmits approved actions or notifies the agent of denials. |

Both triggers use server-side cursors (`created_after` / `decided_after`) so they do not emit duplicates between polls. Both expose Make.com's **Choose where to start** picker: from now on, since a date, choose manually from recent approvals, or all.

---

## Key concepts

### UAPK manifest

Every entity you govern has a manifest (`uapk_id` like `hiring-agent`) describing its capabilities, tool allowlist, budgets, approval thresholds, and deny rules. The Gateway enforces these rules on every call. A manifest must be **ACTIVE** in your org before any evaluate/execute call succeeds.

### Decisions

- **`allow`** — policy passed, proceed. In Execute, the tool fired and `result` is populated.
- **`deny`** — blocked by policy. Reason codes explain why (e.g. `tool_not_allowlisted`, `amount_exceeds_cap`, `counterparty_denied`).
- **`escalate`** — needs human approval. Returns an `approval_id`. The reviewer runs Approve/Deny; the agent then re-submits with the override token.
- **`pending`** (in audit-log listings) — the escalation is still awaiting decision.

### Override tokens

Single-use JWTs issued on approve. The token is bound to the action's hash, so it only works for an Execute Action call with **exactly** the same `uapk_id`, `action_type`, `tool`, `params`, and `counterparty` as the escalation. Replay is impossible — the token is marked consumed after first use.

### Audit chain

Every evaluate/execute call produces one interaction record with:

- Full signed request and result
- SHA-256 `record_hash`
- Link to the previous record (`previous_record_hash`)
- Ed25519 `gateway_signature` over the record

Verify Audit Chain Integrity walks every record, re-computes the hash chain, and checks every signature. Tampering with any record, or deleting any record, breaks the chain and shows up in `errors[]`.

---

## Typical scenarios

### 1. Governed agent action

```
[Webhook: agent submits action]
  ↓
[Execute Action]
  ↓ Router on {{decision}}
  ├─ allow    → downstream workflow (the tool already fired)
  ├─ deny     → log / notify the agent with reasons
  └─ escalate → notify reviewer with {{approval_id}} (Slack, email, Teams)
```

### 2. Human approval loop (parallel scenario)

```
[Watch Approval Decisions]  ← trigger, polls every N minutes
  ↓ Router on {{status}}
  ├─ approved → [Execute Action] with the same inputs + {{override_token}}
  └─ denied   → notify the agent of the denial reason
```

### 3. LLM output governance

```
[ChatGPT / Claude call]
  ↓ output is raw JSON
[Evaluate Agent Decision]       ← uses the raw JSON directly
  ↓ Router on {{decision}}
  ├─ allow    → downstream action
  ├─ deny     → log / notify
  └─ escalate → human review flow
```

### 4. Approvals dashboard

```
[Schedule trigger, every 5 min]
  ↓
[List Pending Approvals] (limit 100)
  ↓
[Iterator → Google Sheets / Airtable / Notion / your dashboard]
```

### 5. Daily audit check

```
[Schedule trigger, daily]
  ↓
[Verify Audit Chain Integrity]
  ↓ Router on {{valid}}
  ├─ true  → ok, log counts
  └─ false → page the security team immediately
```

---

## Common inputs and outputs

### Evaluate Action / Execute Action

**Inputs**

- UAPK Entity (dropdown) — your manifest
- Action Type (cascaded dropdown) — from the manifest's capabilities
- Tool (cascaded dropdown) — from the manifest's tool allowlist
- Agent ID (text, optional) — defaults to `make-agent`
- Tool Parameters (JSON object, optional) — e.g. `{"amount": 50000, "currency": "EUR"}`
- Counterparty (id / type / jurisdiction, optional) — checked against denylists
- Capability Token (advanced) — extra authorization
- Override Token (advanced, Execute only) — single-use token from a prior approval

**Outputs**

- `interaction_id` — audit record ID
- `decision` — `allow` / `deny` / `escalate`
- `approval_id` — present if escalated
- `reasons` — array of `{code, message, details}`
- `policy_version`, `timestamp`
- Execute only: `executed` (bool), `result.success`, `result.data`, `result.duration_ms`

### Approve Action / Deny Action

**Inputs**

- Approval ID (required)
- Notes (optional, ≤ 1000 chars)
- Approve: Override Token Validity in seconds (default 3600, range 60–3600)
- Deny: Reason (optional short code like `policy_violation`)

**Outputs**

- `status` — `approved` or `denied`
- `decided_at`, `decided_by` — when and by whom
- Approve only: `override_token` (JWT) and `override_token_expires_at`

### Watch triggers

**Outputs per bundle**

- `approval_id`, `interaction_id`, `uapk_id`, `agent_id`
- `action` (type, tool, params)
- `counterparty`
- `status`, `created_at`, `expires_at`
- Decisions trigger also includes `decided_at`, `decided_by`, `decision_notes`

---

## Support

- Gateway docs: [https://uapk.info](https://uapk.info)
- API reference: [https://api.uapk.info/docs](https://api.uapk.info/docs)
- Private-preview access: [support@uapk.info](mailto:support@uapk.info)
