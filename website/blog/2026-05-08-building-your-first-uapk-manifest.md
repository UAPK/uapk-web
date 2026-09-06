---
slug: building-your-first-uapk-manifest
title: "Building Your First UAPK Manifest: A Step-by-Step Guide"
authors: [davidsanker]
tags: [uapk-gateway, ai-governance, qualification-funnel, policy-enforcement, audit-logging, compiler]
date: 2026-05-08
description: "Start to finish: run the qualification funnel, identify your frameworks, configure a manifest, register it with the gateway, and make your first policy-governed agent call. Practical guide for day one."
---

The fastest path from zero to a governed AI agent is: run the qualification funnel → get your framework list → configure a manifest → register it → make a call. This post walks through each step with real examples.

If you're impatient, the manifest for a simple US SaaS agent is at the bottom of this post. For everyone else, starting with the qualification funnel means you understand *why* each field is configured the way it is.

<!-- truncate -->

## Step 1: Run the Qualification Funnel

The qualification funnel determines which compliance frameworks apply to your deployment. Four questions:

**1. Where does your agent operate?**

List every jurisdiction where your agent interacts with users, processes their data, or executes transactions. Be conservative — if you serve any EU residents, include EU even if you're a US company.

```
Geographies: ["US", "EU", "UK"]
```

**2. What sector does your organization operate in?**

Pick the most applicable primary sector:
- `financial_services` — banking, payments, lending, trading
- `healthcare` — patient data, clinical systems, insurance
- `legal_tech` — law practice, legal research, contracts
- `crypto` — digital assets, DeFi, exchanges
- `ecommerce` — retail, marketplace, subscription
- `critical_infrastructure` — energy, water, transport
- `general_enterprise` — B2B SaaS without sector concentration

**3. What does your agent do?**

List all activity types. Be specific — the activity list drives framework selection more than any other factor.

```
Activities: [
  "process_personal_data",
  "automated_decision_making",
  "customer_communication",
  "payment_processing"
]
```

**4. What kind of organization are you?**

Organizational traits that trigger specific frameworks:

```
Org traits: [
  "publicly_traded",    # SOX
  "processes_health_data",  # HIPAA
  "handles_crypto"  # MiCA, FATF
]
```

**Running the funnel:**

```bash
cd /path/to/uapk-gateway
python3 scripts/qualify.py \
  --geographies US EU UK \
  --sector financial_services \
  --activities process_personal_data automated_decision_making payment_processing \
  --org-traits publicly_traded
```

Output: a prioritized list of frameworks. For this example: `gdpr, ccpa, glba, sox, iso_27001, nist_csf, pci_dss`.

## Step 2: Understand What Each Framework Requires

For each framework in your list, the key question is: what does this framework require that must be implemented in the manifest?

| Framework | Primary Manifest Requirement |
|-----------|------------------------------|
| GDPR | `require_human_approval` on automated decisions; `audit_retention_days: 2555` |
| CCPA | Counterparty opt-out support; `require_human_approval` on profiling |
| GLBA | Safeguards for financial data; jurisdiction restriction to US |
| SOX | Human approval for financial reporting actions; 7-year retention |
| ISO 27001 | `require_capability_token`; tool allowlist; audit trail |
| PCI-DSS | Jurisdiction allowlist to card scheme markets; tool scope to CDE-adjacent only |

## Step 3: Write the Manifest

A manifest has five sections: `agent`, `capabilities`, `constraints`, `policy`, and `tools`.

```json
{
  "version": "1.0",
  "agent": {
    "id": "my-saas-agent",
    "name": "MyApp Customer Agent",
    "version": "1.0.0",
    "description": "Customer-facing assistant for MyApp SaaS product"
  },
  "capabilities": {
    "requested": [
      "data:read",
      "recommendation:generate",
      "notification:send",
      "payment:query"
    ]
  },
  "constraints": {
    "require_human_approval": [
      "recommendation:generate",
      "payment:execute"
    ],
    "audit_retention_days": 2555,
    "per_action_type_budgets": {
      "notification:send": 100,
      "payment:query": 500
    }
  },
  "policy": {
    "jurisdiction_allowlist": ["US", "EU", "UK"],
    "tool_allowlist": [
      "customer_db",
      "product_catalog",
      "notification_service",
      "payment_gateway_readonly"
    ],
    "require_capability_token": true,
    "approval_thresholds": {
      "action_types": ["payment:execute"],
      "amount": 1000,
      "currency": "USD"
    }
  },
  "tools": [
    {
      "id": "customer_db",
      "type": "http",
      "url": "https://internal.myapp.com/api/customers",
      "auth": {"type": "bearer", "secret_env": "CUSTOMER_DB_TOKEN"}
    },
    {
      "id": "product_catalog",
      "type": "http",
      "url": "https://internal.myapp.com/api/products"
    },
    {
      "id": "notification_service",
      "type": "webhook",
      "url": "https://notifications.myapp.com/send",
      "auth": {"type": "bearer", "secret_env": "NOTIFY_TOKEN"}
    },
    {
      "id": "payment_gateway_readonly",
      "type": "http",
      "url": "https://payments.myapp.com/api/transactions",
      "auth": {"type": "bearer", "secret_env": "PAYMENT_READONLY_TOKEN"}
    }
  ]
}
```

**Key decisions in this manifest:**

- `require_human_approval: ["recommendation:generate"]` — every recommendation the AI generates goes through a review step before reaching the customer. This satisfies GDPR Article 22 and CCPA's automated decision-making requirements.

- `require_human_approval: ["payment:execute"]` — the AI can read payment data but cannot execute payments without approval. Combined with `approval_thresholds.amount: 1000`, payments under $1000 still require human authorization (no amount exception for this action type).

- `audit_retention_days: 2555` — 7 years, covering SOX's books-and-records requirement.

- `tool_allowlist` — four tools, each scoped to read-only or notification functions. The payment gateway is explicitly `_readonly` — there's no write capability declared.

- `jurisdiction_allowlist: ["US", "EU", "UK"]` — the agent can only process requests from these three jurisdictions. Requests from other geographies are denied at the gateway.

## Step 4: Validate the Manifest

Before registering, validate the manifest against the JSON schema:

```bash
python3 -c "
import json, jsonschema
manifest = json.load(open('my-manifest.json'))
schema = json.load(open('schemas/manifest.v1.schema.json'))
jsonschema.validate(manifest, schema)
print('Manifest valid')
"
```

Or use the CLI:

```bash
uapk compile my-manifest.json
```

Common validation errors:
- `capabilities.requested` items must match `^[a-z][a-z0-9-]*:[a-z][a-z0-9-*]*$`
- `audit_retention_days` must be ≥ 365
- All tools in `tool_allowlist` must be declared in the `tools` section
- `approval_thresholds.amount` must be positive

## Step 5: Register with the Gateway

```bash
# Authenticate
export API_KEY="your-api-key"
export BASE_URL="https://api.uapk.info"

# Register the manifest
curl -X POST "$BASE_URL/api/v1/manifests" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @my-manifest.json

# Response:
# {
#   "uapk_id": "msa-abc123",
#   "status": "ACTIVE",
#   "created_at": "2026-05-08T10:00:00Z"
# }

export UAPK_ID="msa-abc123"
```

## Step 6: Issue a Capability Token

Capability tokens scope the agent's permissions to a specific session or task:

```bash
curl -X POST "$BASE_URL/api/v1/capabilities" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "uapk_id": "'$UAPK_ID'",
    "capabilities": ["data:read", "recommendation:generate"],
    "expires_in_seconds": 3600,
    "max_actions": 50
  }'

# Response:
# {"token": "eyJ0eXAiOiJKV1Qi..."}
export CAP_TOKEN="eyJ0eXAiOiJKV1Qi..."
```

## Step 7: Make a Policy-Governed Call

```bash
# Evaluate (dry run — no execution)
curl -X POST "$BASE_URL/api/v1/gateway/evaluate" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "uapk_id": "'$UAPK_ID'",
    "capability_token": "'$CAP_TOKEN'",
    "action_type": "data:read",
    "tool": "customer_db",
    "params": {"customer_id": "cust_12345"},
    "jurisdiction": "US"
  }'

# Response: {"decision": "ALLOW", "interaction_id": "int_..."}

# Execute (if ALLOW)
curl -X POST "$BASE_URL/api/v1/gateway/execute" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "uapk_id": "'$UAPK_ID'",
    "capability_token": "'$CAP_TOKEN'",
    "action_type": "data:read",
    "tool": "customer_db",
    "params": {"customer_id": "cust_12345"},
    "jurisdiction": "US"
  }'
```

The execute response includes an `interaction_id` and the tool result. The interaction record is written to the audit log with a gateway Ed25519 signature and included in the hash chain.

## Step 8: Inspect the Audit Log

```bash
# Get recent interaction records
curl "$BASE_URL/api/v1/orgs/{org_id}/records?limit=10" \
  -H "X-API-Key: $API_KEY"

# Verify chain integrity
curl "$BASE_URL/api/v1/orgs/{org_id}/records/verify/integrity" \
  -H "X-API-Key: $API_KEY"

# Response: {"valid": true, "records_checked": 47, "earliest_timestamp": "..."}
```

If `valid: false`, the chain has been tampered with. The `broken_at_record` field identifies the first invalid record.

## What You've Built

With eight steps and one manifest file, you have:

- A governed AI agent with declared capabilities
- Policy enforcement on every action (jurisdiction, tool scope, amount, human approval)
- An append-only, cryptographically signed audit log
- Framework evidence covering GDPR, CCPA, SOX, and ISO 27001
- The ability to produce a compliance evidence package for any regulator who asks

The manifest is the document. The gateway is the enforcer. The audit log is the proof.
