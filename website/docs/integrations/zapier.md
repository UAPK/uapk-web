---
sidebar_position: 1
title: Zapier
description: Automate UAPK Gateway policy enforcement and approval workflows with Zapier
---

# Zapier Integration

Connect UAPK Gateway to 6,000+ apps through Zapier. Trigger Zaps when actions need approval, evaluate policies before executing automations, and maintain a tamper-evident audit trail — all without writing code.

## What You Can Do

| Action | Description |
|--------|-------------|
| **Evaluate Action** | Check an agent's action against your policies (dry run — no execution) |
| **Execute Action** | Evaluate and execute the action if the policy allows it |
| **Approve Action** | Approve an escalated action that is pending human review |
| **Deny Action** | Deny a pending escalated action |
| **Find Approval** | Look up the status of a specific approval request |
| **List Pending Approvals** | Get all approvals waiting for a human decision |
| **List Audit Records** | Query the audit log with filters |

## Use Cases

**Human-in-the-loop for AI agents**
When an AI agent tries to execute a high-risk action (wire transfer, contract signing, account deletion), UAPK escalates it. Use Zapier to route that approval request to Slack, email, or a ticketing system — and write the approve/deny decision back to UAPK when a human responds.

**Compliance audit exports**
Trigger a Zap on a schedule to pull audit records from UAPK and push them to your SIEM, data warehouse, or compliance reporting tool (Splunk, Google Sheets, Notion, etc.).

**Policy gate before critical automations**
Before your Zapier automation executes a sensitive step, run an Evaluate Action first. If the policy returns `deny`, branch the Zap to an alert path instead of proceeding.

## Setup

### Prerequisites

- A running UAPK Gateway instance (self-hosted or `api.uapk.info`)
- An organization ID and API key from your UAPK dashboard
- A Zapier account (free tier works for testing)

### Authentication

The Zapier integration uses API Key authentication. You will be prompted for:

| Field | Where to find it |
|-------|-----------------|
| **Base URL** | Your gateway URL, e.g. `https://api.uapk.info` |
| **Organization ID** | Dashboard → Settings → Organization ID |
| **API Key** | Dashboard → Settings → API Keys → Create Key |
| **Management Token** | Required for approval actions — Dashboard → Settings → Management Tokens |

### Creating Your First Zap

**Example: Slack alert when an agent action is escalated**

1. **Trigger:** Schedule or Webhook (from your agent notifying Zapier)
2. **Action 1 — UAPK Gateway → List Pending Approvals** to fetch open items
3. **Action 2 — Slack → Send Message** with the escalation details and approval link
4. **Action 3 — (optional) UAPK Gateway → Approve/Deny Action** once the human responds via Slack

## Action Reference

### Evaluate Action

Checks whether an agent action would be allowed by your current policies. **Does not execute the action.**

```
Resource: Gateway
Operation: Evaluate Action
```

| Input | Required | Description |
|-------|----------|-------------|
| UAPK ID | ✅ | Agent identifier from the manifest |
| Agent Instance ID | ✅ | Unique session/instance ID |
| Action Type | ✅ | Action category, e.g. `send_email`, `transfer_funds` |
| Tool | ✅ | Connector to use, e.g. `email:send` |
| Parameters | ✅ | JSON object of action parameters |
| Counterparty | ❌ | Recipient details (ID, type, jurisdiction) |
| Amount | ❌ | Financial amount (triggers amount limit checks) |

**Returns:** `allow`, `deny`, or `escalate` with policy evaluation details.

### Execute Action

Evaluates the policy and, if allowed, executes the action through the configured connector.

| Input | Required | Description |
|-------|----------|-------------|
| Same as Evaluate | | |
| Override Token | ❌ | One-time token issued after human approval |

**Returns:** Execution result or denial reason.

### Approve / Deny Action

Resolves a pending escalated action.

| Input | Required | Description |
|-------|----------|-------------|
| Approval ID | ✅ | UUID of the pending approval |
| Comment | ❌ | Reason for the decision (logged in audit trail) |

### List Audit Records

Query the tamper-evident audit log.

| Input | Required | Description |
|-------|----------|-------------|
| Start Time | ❌ | ISO 8601 datetime |
| End Time | ❌ | ISO 8601 datetime |
| Action Type | ❌ | Filter by action category |
| Decision | ❌ | `allow`, `deny`, or `escalate` |
| Limit | ❌ | Max records to return (default 50) |

## Installing the Integration

The UAPK Gateway Zapier app is currently in private beta. To get access:

1. Contact [support@uapk.info](mailto:support@uapk.info) with subject "Zapier Beta Access"
2. You'll receive an invitation link to install the private app
3. Once the app completes Zapier's review process, it will be available publicly at `zapier.com/apps/uapk-gateway`

## Self-Hosting

If you run a self-hosted UAPK Gateway instance, the Zapier integration source is included in the SDK:

```bash
git clone https://github.com/UAPK/gateway.git
cd sdks/zapier
npm install
zapier push   # requires zapier-platform-cli and your Zapier developer account
```

See the [Zapier Platform docs](https://platform.zapier.com/reference/cli-docs) for details on running your own private copy.
