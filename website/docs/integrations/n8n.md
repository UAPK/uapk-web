---
sidebar_position: 3
title: n8n
description: Use UAPK Gateway in n8n workflows with the official community node
---

# n8n Integration

The UAPK Gateway community node for n8n lets you enforce AI agent policies, manage human approvals, and query audit logs directly inside your n8n workflows. It's published on npm and installs with one click.

## Installation

1. Open your n8n instance
2. Go to **Settings → Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-uapk-gateway`
5. Click **Install**

The node appears in your palette under **UAPK Gateway**.

:::tip npm package
`n8n-nodes-uapk-gateway` is published at [npmjs.com/package/n8n-nodes-uapk-gateway](https://www.npmjs.com/package/n8n-nodes-uapk-gateway)
:::

## Resources and Operations

The node has three resources, each with multiple operations:

### Gateway

| Operation | Description |
|-----------|-------------|
| **Evaluate** | Policy check without execution (dry run, 120 req/min) |
| **Execute** | Policy check + execution if allowed (60 req/min) |

The node has **three output pins**:
- **Allow** — action was permitted and executed
- **Deny** — action was blocked by policy
- **Escalate** — action requires human approval before proceeding

Route your workflow branches based on which pin fires.

### Approval

| Operation | Description |
|-----------|-------------|
| **Get** | Fetch the current status of a pending approval |
| **Approve** | Approve an escalated action |
| **Deny** | Deny an escalated action |
| **List Pending** | Get all open approvals for your organization |

### Records

| Operation | Description |
|-----------|-------------|
| **List** | Query the audit log with filters |
| **Verify Integrity** | Confirm the hash chain has not been tampered |

## Setup

### Credentials

Create a new **UAPK Gateway API** credential in n8n:

| Field | Where to find it |
|-------|-----------------|
| **Base URL** | Your gateway URL, e.g. `https://api.uapk.info` |
| **Organization ID** | Dashboard → Settings → Organization ID |
| **API Key** | Dashboard → Settings → API Keys |
| **Management Token** | Required for approve/deny — Dashboard → Settings → Management Tokens |

### Example: Three-branch workflow

```
[Trigger: HTTP / Schedule / Agent event]
    ↓
[UAPK Gateway: Gateway → Execute]
    ↓ (three outputs)
    ├── Allow   → [Continue workflow normally]
    ├── Deny    → [Send alert / log the denial]
    └── Escalate → [Notify approver via email/Slack]
                       ↓ (when approver responds)
                   [UAPK Gateway: Approval → Approve/Deny]
```

## Source Code

The node source is included in the UAPK Gateway SDK:

```bash
git clone https://github.com/UAPK/gateway.git
cd sdks/n8n
npm install && npm run build
```
