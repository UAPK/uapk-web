---
title: Wrapped UAPK — Onboarding Existing Agents
description: How an existing agent or application becomes Level 1 Wrapped UAPK — the fastest path to governance without rewriting your agent logic.
sidebar_position: 10
---

# Wrapped UAPK — Onboarding Existing Agents

**Wrapped UAPK is the fastest path to governed execution.** You do not rewrite your agent. You do not change your core logic. You route your agent's outbound actions through UAPK Gateway and register a manifest that declares what the agent is allowed to do.

---

## The UAPK Conformance Ladder

UAPK defines four conformance levels. Wrapped is Level 1 — the entry point for any existing agent or application.

| Level | Name | What it means |
|-------|------|---------------|
| 1 | **Wrapped** | Agent routes actions through UAPK Gateway. Manifest governs what it can do. Audit trail is external to the agent. |
| 2 | **Managed** | Agent is deployed and operated inside a UAPK-managed environment. Governance is enforced at runtime, not just at the API boundary. |
| 3 | **Reconstructable** | Agent logic can be fully reconstructed from UAPK manifests and interaction records. No opaque state. |
| 4 | **Native UAPK** | Agent is defined natively in UAPK — manifest is the source of truth. Governance is not a layer; it is the execution substrate. |

**Most organisations start at Level 1.** It is useful on day one and takes hours, not weeks.

---

## What You Need to Wrap an Agent

1. **A running UAPK Gateway instance** — self-hosted (see [Quickstart](/docs/guides/quickstart/)) or deployed via a [Pilot engagement](/docs/business/pilot/)
2. **An existing agent** — any agent that calls external tools or APIs (LangChain, CrewAI, AutoGen, custom Python, n8n, Make.com, etc.)
3. **A manifest** — a YAML file that declares the agent's identity, capabilities, and governance rules

That's it. No changes to your agent's core logic required.

---

## Step 1 — Write a Manifest

A manifest is a declaration of what your agent is, what it can do, and under what constraints.

```yaml
# manifest.yaml
uapk_id: my-agent-v1
display_name: My Existing Agent
description: Handles outbound communications and data lookups
owner_org: your-org-id

capabilities:
  - communications.send_email
  - data.read_customer_record
  - data.update_crm

policies:
  - action: "communications.*"
    rate_limit: 100/hour
    require_approval_above: null
    counterparty_denylist: []

  - action: "data.update_*"
    require_approval: false
    jurisdiction_allowlist: [DE, EU]

budgets:
  daily_action_limit: 500
  daily_spend_limit: null

escalation:
  channel: webhook
  webhook_url: https://your-approval-system.example.com/uapk-hook
```

**Key manifest concepts:**

- `uapk_id` — unique identifier for this agent across your organisation
- `capabilities` — the action types this agent is permitted to invoke (anything not listed is denied by default)
- `policies` — rules applied to each action type: rate limits, approval thresholds, jurisdiction constraints
- `budgets` — daily caps on action count and/or spend
- `escalation` — where ESCALATE decisions are sent for human review

See the full [manifest schema reference](/docs/concepts/manifest/) for all available fields.

---

## Step 2 — Register the Manifest

With your UAPK Gateway running and your manifest ready:

```bash
# Using the UAPK CLI
uapk compile manifest.yaml
uapk register --host https://your-gateway.example.com --org your-org-id manifest.yaml

# Or via the REST API directly
curl -X POST https://your-gateway.example.com/api/v1/manifests \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d @manifest.json
```

The gateway returns a `manifest_id` and issues a **capability token** — a signed credential your agent presents on every call.

---

## Step 3 — Route Actions Through the Gateway

Instead of calling your tools directly, your agent calls the UAPK Gateway `/execute` endpoint:

**Before (direct tool call):**
```python
# Agent calls tool directly — no governance
result = send_email(to=recipient, subject=subject, body=body)
```

**After (Wrapped UAPK):**
```python
import uapk

client = uapk.Client(
    gateway_url="https://your-gateway.example.com",
    capability_token=os.environ["UAPK_CAPABILITY_TOKEN"],
)

result = client.execute(
    uapk_id="my-agent-v1",
    action={
        "type": "communications.send_email",
        "tool": "send_email",
        "params": {
            "to": recipient,
            "subject": subject,
            "body": body,
        },
    },
)

if result.decision == "ALLOW":
    print(f"Executed. Audit record: {result.interaction_id}")
elif result.decision == "ESCALATE":
    print(f"Pending human approval. Token: {result.escalation_token}")
elif result.decision == "DENY":
    raise PermissionError(f"Action denied: {result.reason}")
```

The gateway enforces your manifest rules, executes the action via its connector, and writes a tamper-evident audit record — before returning the result to your agent.

---

## What You Get at Level 1 (Wrapped)

Once wrapped, every action your agent takes:

| Governance feature | How it works |
|-------------------|-------------|
| **Identity** | Every action is attributed to `my-agent-v1` via manifest registration |
| **Capability enforcement** | Actions not listed in capabilities are denied before execution |
| **Policy rules** | Rate limits, jurisdiction constraints, and counterparty denylists enforced per action type |
| **Budget caps** | Daily action and spend limits enforced atomically |
| **Approval workflow** | Actions above thresholds are escalated to a human approver; execution is blocked until approved |
| **Tamper-evident audit log** | Every interaction written as a hash-chained, Ed25519-signed record |
| **Audit export** | Evidence bundles exportable in S3 Object Lock format for regulators and auditors |

---

## What Wrapped Does NOT Give You

Level 1 is intentionally minimal. The audit trail lives outside the agent — if the agent bypasses the gateway, nothing is recorded. Level 1 does not give you:

- Governance that the agent cannot bypass (that is Level 2 — Managed)
- Full reconstructability of agent state from records (Level 3)
- Governance as execution substrate (Level 4 — Native UAPK)

For regulated environments where bypass-resistance is required, ask about [Managed deployment](/docs/business/pilot/) — where the gateway is the only execution path available to the agent by construction.

---

## Wrapping LangChain Agents

If your agent uses LangChain tools, the Python SDK provides a drop-in wrapper:

```python
from langchain.tools import tool
from uapk.langchain import UAPKTool

# Wrap any LangChain tool with UAPK governance
governed_send_email = UAPKTool(
    tool=send_email_tool,
    uapk_id="my-agent-v1",
    action_type="communications.send_email",
    client=uapk_client,
)

# Use in your agent exactly as before
agent = initialize_agent(
    tools=[governed_send_email, ...],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
)
```

See [LangChain Integration Guide](/docs/guides/agent-integration/) for full details.

---

## Wrapping n8n / Make.com / Zapier Workflows

For no-code/low-code platforms, use the UAPK HTTP module:

1. Replace direct tool calls with an HTTP request to `/api/v1/gateway/execute`
2. Set the `X-API-Key` header with your gateway API key
3. Parse the `decision` field in the response before proceeding

See [n8n Integration](/docs/integrations/n8n/), [Make.com Integration](/docs/integrations/make/), or [Zapier Integration](/docs/integrations/zapier/) for step-by-step setup.

---

## Next Steps

- **Self-host and wrap today** → [Quickstart](/docs/quickstart/)
- **Need expert wrapping for a regulated workflow** → [Agent Governance Pilot](/docs/business/pilot/)
- **Want governance design before wrapping** → [Blueprint Package](/docs/business/pricing/#2-blueprint-package)
- **Read the full manifest schema** → [Manifest Reference](/docs/concepts/manifest/)
