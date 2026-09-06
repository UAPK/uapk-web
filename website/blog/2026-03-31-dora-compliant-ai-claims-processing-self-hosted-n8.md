---
slug: dora-compliant-ai-claims-processing-self-hosted-n8
title: "DORA-Compliant AI Claims Processing: Self-Hosted n8n + UAPK Gateway"
authors: [davidsanker]
date: 2026-03-31
---

## TL;DR
- BaFin expects German insurers to maintain human oversight for AI decisions under GDPR Art. 22, especially for medical claims involving Art. 9 special category data
- DORA requires ICT risk management with incident reporting and quarterly resilience testing for financial entities' AI systems
- UAPK Gateway's on-premises deployment provides approval workflows, amount caps, and audit trails without cloud dependencies

## The Problem

Say you run a German insurance company processing 50,000 claims monthly through an AI-powered n8n workflow hosted in your data center. Your system analyzes medical records, vehicle damage photos, and police reports to generate settlement recommendations. The regulatory landscape is unforgiving.

Under DORA (Digital Operational Resilience Act), which applies to all EU financial entities including insurers, you must implement comprehensive ICT risk management per Article 8, conduct quarterly resilience testing under Article 25, and report major ICT incidents within 24 hours per Article 19. BaFin's supervisory expectations specifically address AI governance in insurance operations.

GDPR creates additional complexity. Article 9 restricts processing of health data in medical claims, requiring explicit consent or vital interest justification. Article 22 prohibits purely automated decision-making with legal effects unless explicit consent exists or it's necessary for contract performance — but even then, you must provide human review rights and meaningful information about the logic involved.

The German Federal Data Protection Act (BDSG) supplements GDPR with national specifics. Section 37 BDSG requires data protection officers for insurance companies, and the federal insurance supervision law (VAG) mandates actuarial oversight of automated underwriting systems.

Your current n8n setup processes claims end-to-end without human checkpoints. Medical claims containing MRI reports and psychiatric evaluations flow through AI analysis directly to payout decisions. Claims exceeding €100,000 auto-approve without senior review. No resilience testing framework exists, and incident reporting is manual. This setup violates multiple regulations simultaneously.

## How UAPK Gateway Handles It

UAPK Gateway deploys as an on-premises systemd service between your n8n workflows and downstream systems, enforcing compliance rules through declarative policies. Here's the manifest configuration for claims processing:

```json
{
  "name": "insurance-claims-processing",
  "version": "1.0.0",
  "description": "AI claims processing with GDPR and DORA compliance",
  "agents": [
    {
      "name": "claims-processor",
      "actions": [
        {
          "name": "process_medical_claim",
          "requires_approval": true,
          "approval_policy": "medical_claims_human_review",
          "amount_caps": {
            "per_transaction": 50000,
            "daily_total": 200000
          },
          "time_windows": {
            "allowed": ["09:00-17:00 CET"]
          }
        },
        {
          "name": "process_property_claim", 
          "requires_approval": true,
          "approval_policy": "high_value_claims",
          "conditions": [
            {
              "field": "claim_amount",
              "operator": ">",
              "value": 10000
            }
          ]
        }
      ]
    }
  ],
  "approval_policies": [
    {
      "name": "medical_claims_human_review",
      "description": "GDPR Art. 22 + Art. 9 compliance for health data",
      "approvers": [
        {
          "role": "senior_adjuster",
          "required": true
        },
        {
          "role": "medical_reviewer", 
          "required": true,
          "conditions": [
            {
              "field": "contains_health_data",
              "operator": "==",
              "value": true
            }
          ]
        }
      ],
      "escalation": {
        "timeout_hours": 4,
        "escalate_to": "head_of_claims"
      }
    },
    {
      "name": "high_value_claims",
      "approvers": [
        {
          "role": "team_lead",
          "required": true
        }
      ]
    }
  ],
  "circuit_breakers": [
    {
      "name": "excessive_denials",
      "condition": "denial_rate > 0.8 AND denial_count > 10 in 1h",
      "action": "halt_processing"
    }
  ],
  "audit": {
    "retention_years": 10,
    "include_approval_trails": true,
    "gdpr_deletion_support": true
  }
}
```

The gateway enforces business hour restrictions (09:00-17:00 CET) for automated payouts, preventing weekend processing when senior adjusters aren't available. Circuit breakers halt processing if denial rates spike above 80% with more than 10 denials per hour, indicating potential system malfunction.

For DORA compliance, the resilience testing policy runs weekly dry runs:

```yaml
resilience_testing:
  schedule: "weekly"
  test_types:
    - dependency_failure
    - load_spike  
    - data_corruption
  notification_webhook: "https://internal.your-company.com/dora-incidents"
  documentation_required: true
```

## The Integration

Your on-premises architecture keeps all data processing within your data center boundaries. The n8n instance running on your internal Kubernetes cluster connects to UAPK Gateway deployed as a systemd service on dedicated hardware.

```
[n8n Workflows] → [UAPK Gateway] → [Core Banking System]
       ↓                 ↓                    ↓
[Document AI]    [Approval API]      [Payment Rails]
       ↓                 ↓                    ↓  
[Risk Scoring]   [Audit Database]   [Settlement System]
```

The n8n workflow integrates through UAPK Gateway's SDK:

```python
from uapk_gateway import Gateway, ActionRequest

# Initialize gateway connection (local unix socket)
gateway = Gateway(socket_path="/var/run/uapk/gateway.sock")

# Process claim through AI analysis
def process_claim(claim_data):
    # Extract claim details
    claim_amount = claim_data.get("amount", 0)
    contains_medical = claim_data.get("medical_records", False)
    
    # Determine action based on claim type
    action_name = "process_medical_claim" if contains_medical else "process_property_claim"
    
    # Submit to UAPK Gateway
    request = ActionRequest(
        agent="claims-processor",
        action=action_name,
        payload={
            "claim_id": claim_data["id"],
            "amount": claim_amount,
            "claim_type": claim_data["type"],
            "contains_health_data": contains_medical,
            "ai_confidence": claim_data.get("ai_confidence", 0.0),
            "supporting_documents": claim_data.get("documents", [])
        }
    )
    
    response = gateway.execute(request)
    
    if response.requires_approval:
        # Store pending status, notify approvers
        update_claim_status(claim_data["id"], "pending_approval")
        notify_approvers(response.approval_id, claim_data)
        return {"status": "pending_approval", "approval_id": response.approval_id}
    
    # Auto-approved within limits
    return {"status": "approved", "payout_amount": response.approved_amount}
```

The n8n workflow node configuration connects to the local gateway:

```javascript
// n8n Custom Node - UAPK Gateway Claims Processing
const items = this.getInputData();

for (let i = 0; i < items.length; i++) {
    const claim = items[i].json;
    
    const requestBody = {
        agent: 'claims-processor',
        action: claim.medical_records ? 'process_medical_claim' : 'process_property_claim',
        payload: {
            claim_id: claim.id,
            amount: claim.amount,
            contains_health_data: !!claim.medical_records,
            claim_type: claim.type
        }
    };
    
    const response = await this.helpers.request({
        method: 'POST',
        url: 'http://localhost:8080/api/v1/actions/execute',
        body: requestBody,
        json: true
    });
    
    items[i].json = { ...claim, gateway_response: response };
}

return [items];
```

## Compliance Mapping

| Regulation | Requirement | UAPK Gateway Feature |
|------------|-------------|---------------------|
| **GDPR Art. 22** | Right to human review of automated decisions | `requires_approval: true` for all claim processing actions |
| **GDPR Art. 9** | Special protection for health data | `medical_reviewer` role required when `contains_health_data: true` |
| **DORA Art. 8** | ICT risk management framework | Circuit breakers, amount caps, time windows |
| **DORA Art. 19** | ICT incident reporting within 24h | Webhook notifications on circuit breaker triggers |
| **DORA Art. 25** | Resilience testing quarterly | Automated dry runs with `resilience_testing` policy |
| **BDSG §37** | Data protection officer involvement | Audit trails include DPO notification hooks |
| **BaFin AI Guidance** | Senior oversight for high-value decisions | Escalation to `head_of_claims` for claims >€10,000 |
| **VAG** | Actuarial review requirements | Integration with actuarial systems through approval workflows |

The gateway's audit system maintains detailed logs for 10 years per German insurance law requirements. All approval decisions, timing, and reasoning are preserved with cryptographic integrity. GDPR deletion requests trigger special handling that removes personal data while preserving anonymized decision patterns for regulatory examination.

Circuit breakers provide the operational resilience DORA demands. If AI model performance degrades (detected through excessive denial rates), processing halts automatically rather than continuing with potentially faulty decisions. The incident webhook immediately notifies your DORA incident response team.

Time window restrictions ensure human oversight availability. Weekend or after-hours claim processing requires explicit senior adjuster override, preventing AI systems from making unsupervised decisions when review capacity is limited.

## What This Looks Like in Practice

At 10:30 AM on Tuesday, your n8n workflow receives a €15,000 motor vehicle claim including medical reports from the accident scene. The workflow extracts text from PDF medical records, runs computer vision analysis on vehicle damage photos, and generates a settlement recommendation with 87% confidence.

The workflow calls UAPK Gateway's execute endpoint with the processed claim data. Gateway evaluates the request against the manifest:

1. **Action Match**: `process_medical_claim` triggered due to medical records present
2. **Amount Check**: €15,000 exceeds €10,000 threshold, requires approval
3. **Health Data**: Medical records trigger GDPR Art. 9 protection requirements
4. **Time Window**: 10:30 AM falls within allowed 09:00-17:00 CET window
5. **Circuit Breaker**: Current denial rate 12% with 3 denials in past hour — normal operation

Gateway creates approval request requiring both `senior_adjuster` and `medical_reviewer` roles. The system identifies Sarah Mueller (senior adjuster) and Dr. Hans Bergmann (medical reviewer) as available approvers. Both receive notifications through your internal messaging system.

Dr. Bergmann reviews the medical aspects within 90 minutes, approving the health data processing and confirming the claimed injuries align with accident circumstances. Sarah Mueller reviews the overall claim validity and AI confidence score, noting the 87% confidence exceeds your 80% threshold for AI-assisted decisions.

Both approvals complete by 1:15 PM. Gateway logs the full decision trail, releases the payout instruction to your core banking system, and updates audit records. The entire process maintains human oversight while leveraging AI efficiency.

If either approver had been unavailable beyond the 4-hour escalation timeout, the claim would automatically escalate to Maria Hoffmann, Head of Claims, ensuring no claim stalls due to individual unavailability.

## Conclusion

German insurance companies face complex compliance requirements spanning GDPR health data protection, DORA operational resilience, and BaFin AI governance expectations. UAPK Gateway provides the control layer needed to maintain human oversight, implement risk controls, and generate audit trails — all while keeping your AI claims processing on-premises and efficient.

The self-hosted deployment eliminates cloud dependency risks that could trigger additional DORA requirements. Your n8n workflows continue processing thousands of claims daily, but now with compliance guardrails that satisfy both regulators and your risk management framework.

Ready to implement compliant AI claims processing? Check out the [UAPK Gateway documentation](https://docs.uapkgateway.com) and try the [manifest builder](https://uapkgateway.com/manifest-builder) to configure your specific compliance requirements.

RegTech, Insurance, GDPR, DORA, BaFin, n8n, AI Compliance, German Insurance Law