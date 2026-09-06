---
slug: manufacturing-ai-quality-control-iso-27001-eu-ai-a
title: "Manufacturing AI Quality Control: ISO 27001 + EU AI Act Compliance"
authors: [davidsanker]
date: 2026-03-31
---

## TL;DR
- Manufacturing AI visual inspection systems fall under EU AI Act Article 6 as high-risk AI when used as safety components in regulated products
- ISO 27001 Annex A.9 requires explicit access controls for all systems including AI agents — UAPK Gateway's capability tokens enforce this per-session
- Kill switches and approval thresholds prevent runaway AI decisions that could halt production or trigger mass rework orders costing thousands

## The Problem

Say you run a manufacturing company producing automotive components, medical devices, or industrial machinery. You're ISO 9001 certified for quality management and ISO 27001 certified for information security. You've deployed computer vision AI agents on your production line — cameras inspect parts, ML models flag defects, agents automatically trigger rework workflows and update your ERP system.

This setup creates multiple compliance headaches. Under ISO 27001 Annex A.9.1, you need "access control policy" for all information processing facilities. Your AI agents are accessing SAP, triggering Slack notifications, sending emails — but traditional access controls don't work well for autonomous agents that need to act without human login sessions.

ISO 27001 Annex A.12.4 requires "logging of events and activities" with sufficient detail for security monitoring. Your agents are making hundreds of decisions per hour across multiple systems. You need to track who (which agent), what (rejected batch #XY789), when (timestamp), and why (confidence score below threshold) — but your current logging is scattered across different systems.

The bigger issue is the EU AI Act. Article 6(2) classifies AI systems as high-risk when they're used as "safety components of products, or are products themselves, covered by Union harmonisation legislation." If you're manufacturing automotive parts under UN Regulation No. 79, medical devices under MDR 2017/745, or machinery under Directive 2006/42/EC, your quality control AI likely qualifies as high-risk.

This triggers Article 12's logging requirements: you need "automatic recording of events" with sufficient detail to enable "traceability throughout the system's lifecycle." Article 14 requires "human oversight" — humans must be able to "interrupt the system operation or influence the system operation" through a "stop procedure."

Traditional manufacturing execution systems (MES) and ERP platforms weren't built for these AI-specific requirements. You need fine-grained control over what your AI agents can do, when they can do it, and immediate kill switches when things go wrong.

## How UAPK Gateway Handles It

UAPK Gateway sits between your AI agents and downstream systems, enforcing policies that map directly to regulatory requirements. Here's how the manifest handles manufacturing quality control:

```json
{
  "manifest_version": "1.0",
  "gateway_id": "manufacturing-qc-prod",
  "auth": {
    "require_capability_token": true,
    "token_scope": "production_line_inspection"
  },
  "time_windows": {
    "production_hours": {
      "monday": ["06:00-22:00"],
      "tuesday": ["06:00-22:00"],
      "wednesday": ["06:00-22:00"],
      "thursday": ["06:00-22:00"],
      "friday": ["06:00-22:00"],
      "saturday": ["08:00-16:00"],
      "timezone": "Europe/Berlin"
    }
  },
  "tools": {
    "allowlist": ["sap_api", "slack_webhook", "email_smtp"],
    "blocklist": ["file_upload", "external_api"]
  }
}
```

The `require_capability_token: true` setting enforces ISO 27001 A.9 compliance by requiring explicit authorization for each agent session. Unlike traditional API keys that persist indefinitely, capability tokens are issued for specific tasks and time periods.

Policy rules handle the business logic:

```json
{
  "policies": {
    "approval_thresholds": {
      "reject_batch": {
        "condition": "estimated_financial_impact > 5000",
        "action": "REQUIRE_APPROVAL",
        "approvers": ["production_manager", "quality_director"]
      }
    },
    "amount_caps": {
      "batch_rejections": {
        "limit": 10,
        "window": "1h",
        "action": "BLOCK_AND_NOTIFY"
      }
    },
    "kill_switches": {
      "high_rejection_rate": {
        "condition": "rejection_rate > 0.15 AND window = 1h",
        "action": "HALT_SYSTEM",
        "notification_channels": ["slack://production-alerts", "email://ops-team@company.com"]
      }
    }
  }
}
```

Your Python service integrates through the SDK:

```python
from uapk_gateway import UAPKClient

client = UAPKClient(
    gateway_url="https://manufacturing-qc.uapk-gateway.com",
    capability_token=os.environ["UAPK_CAPABILITY_TOKEN"]
)

def process_inspection_result(part_id, defect_detected, confidence_score):
    if defect_detected and confidence_score > 0.85:
        # High confidence defect - proceed with automated rework
        response = client.execute_tool(
            tool_name="sap_api",
            parameters={
                "action": "create_rework_order",
                "part_id": part_id,
                "defect_type": "surface_scratch",
                "estimated_cost": 250
            },
            context={
                "inspection_batch": "B2024-0123",
                "production_line": "Line_3",
                "shift": "Morning"
            }
        )
        
        if response.requires_approval:
            client.execute_tool(
                tool_name="slack_webhook",
                parameters={
                    "channel": "#production-approvals",
                    "message": f"Rework order requires approval: Part {part_id}, Cost €{response.estimated_cost}"
                }
            )
```

## The Integration

Your architecture flows from edge AI hardware through UAPK Gateway to downstream systems. Edge devices (industrial cameras with embedded inference chips) run computer vision models locally for real-time part inspection. These devices feed results to a central Python service that aggregates data, applies business rules, and makes decisions about rework, notifications, and ERP updates.

The Python service connects to UAPK Gateway, which then orchestrates actions through Zapier webhooks. Here's the flow:

1. **Edge AI**: Camera captures image, CNN model detects defects, outputs confidence scores
2. **Central Service**: Aggregates results from multiple inspection points, applies thresholds
3. **UAPK Gateway**: Enforces policies, logs decisions, triggers approvals when needed  
4. **Zapier Integration**: Receives webhook from Gateway, routes to SAP/Slack/email based on action type

Zapier configuration handles the downstream routing:

```javascript
// Zapier webhook trigger
const webhookData = inputData;
const actionType = webhookData.tool_name;
const parameters = webhookData.parameters;

if (actionType === 'sap_api') {
  // Route to SAP production order creation
  const sapResponse = await fetch('https://sap-system.company.com/api/production_orders', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + sapToken },
    body: JSON.stringify({
      part_number: parameters.part_id,
      order_type: 'REWORK',
      cost_center: parameters.cost_center
    })
  });
} else if (actionType === 'slack_webhook') {
  // Send notification to production team
  await fetch(slackWebhookUrl, {
    method: 'POST',
    body: JSON.stringify({
      text: parameters.message,
      channel: parameters.channel
    })
  });
}
```

The Gateway's audit logs capture every decision with enough detail for ISO 27001 and EU AI Act compliance. Each log entry includes the original inspection data, applied business rules, system responses, and human interventions (if any).

## Compliance Mapping

| Regulation | Requirement | UAPK Gateway Feature |
|------------|-------------|---------------------|
| ISO 27001 A.9.1 | Access control policy for all systems | `require_capability_token: true` - explicit auth per agent session |
| ISO 27001 A.9.2 | Access to networks and network services controlled | `time_windows` restrict agent access to production hours only |
| ISO 27001 A.12.4 | Logging of events and activities | Comprehensive audit trail with action details, timestamps, outcomes |
| ISO 27001 A.12.6 | Management of technical vulnerabilities | Tool allowlist prevents agents from accessing unauthorized services |
| EU AI Act Art. 12(1) | Automatic recording enabling traceability | Structured logs with inspection ID, confidence scores, business context |
| EU AI Act Art. 12(2) | Logs stored for appropriate period | 3-year retention policy for product liability compliance |
| EU AI Act Art. 14(1) | Human oversight of high-risk AI | Approval thresholds for high-impact decisions (batch rejections > €5000) |
| EU AI Act Art. 14(4) | Ability to interrupt or stop AI system | Kill switches halt operations when rejection rates exceed 15% per hour |
| EU AI Act Art. 15 | Accuracy, robustness, cybersecurity | Amount caps prevent runaway decisions (max 10 rejections/hour) |

The Gateway's manifest versioning supports ISO 9001's document control requirements. Each policy change creates a new manifest version with timestamps and change descriptions, maintaining an audit trail of configuration evolution.

Per-action-type budgets implement additional safety controls: 5000 inspections per day prevents overuse of inference resources, while 100 rework orders per day catches systematic quality issues that might indicate upstream process problems.

## What This Looks Like in Practice

At 10:15 AM on Tuesday morning, your Line 3 camera captures an image of automotive brake component #BP-2024-0892. The edge AI model detects a surface defect with 87% confidence. The central Python service receives this result along with context: part cost (€450), customer criticality (Tier 1 automotive), and current batch status (23 of 100 parts inspected).

The service calls UAPK Gateway to execute a rework order:

```bash
curl -X POST https://manufacturing-qc.uapk-gateway.com/v1/execute \
  -H "Authorization: Bearer ${CAPABILITY_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "tool_name": "sap_api",
    "parameters": {
      "action": "create_rework_order",
      "part_id": "BP-2024-0892",
      "estimated_cost": 450,
      "defect_confidence": 0.87
    },
    "context": {
      "batch_id": "B2024-0156",
      "line": "Line_3",
      "inspector_model": "defect_detection_v2.1"
    }
  }'
```

UAPK Gateway evaluates the request against configured policies. The estimated cost (€450) falls below the approval threshold (€5000), so no human approval is required. The batch rejection counter shows 3 rejections in the past hour, well below the 10-rejection limit. The kill switch monitoring shows current rejection rate at 8%, below the 15% threshold.

Gateway approves the request and forwards it to Zapier, which creates the SAP rework order and sends a Slack notification to the quality team. The full interaction is logged with inspection details, policy evaluation results, and downstream system responses.

At 2:30 PM, the same line experiences a sensor calibration issue. Multiple parts get flagged with high confidence scores, triggering 12 rework orders in 15 minutes. When the hourly rejection count hits 11, UAPK Gateway blocks further rework requests and sends alerts to the production management Slack channel and operations email list. The kill switch prevents a cascade of unnecessary rework orders while human operators investigate the root cause.

## Conclusion

Manufacturing AI quality control hits multiple regulatory frameworks simultaneously — ISO 27001 for information security, EU AI Act for high-risk AI systems, and industry-specific safety standards. UAPK Gateway provides the policy enforcement and audit trail infrastructure these regulations require, without disrupting your existing production workflows.

The key insight is treating AI agents as first-class participants in your information security and quality management systems. They need explicit access controls, activity logging, human oversight mechanisms, and emergency stops — just like any other critical system component.

Ready to implement compliant AI quality control? Check the manifest builder at uapk-gateway.com/builder for manufacturing-specific templates, or review the full SDK documentation for Python integration examples.

compliance, manufacturing AI, ISO 27001, EU AI Act, computer vision, quality control, automation governance, regulatory technology