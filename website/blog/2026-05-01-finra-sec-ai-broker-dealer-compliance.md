---
slug: finra-sec-ai-broker-dealer-compliance
title: "FINRA and the SEC: AI Compliance for Broker-Dealers and Investment Advisers"
authors: [davidsanker]
tags: [finra, sec-cyber, financial-services, trading-systems, ai-governance, audit-logging, uapk-gateway]
date: 2026-05-01
description: "FINRA Rule 3110, SEC Regulation Best Interest, and the SEC's 2024 AI guidance create specific obligations for broker-dealers and investment advisers using AI agents in client-facing and trading functions."
---

FINRA and the SEC have moved from observation to active expectation on AI. FINRA's 2024 AI in Financial Services report outlined specific examination focus areas. The SEC's 2024 guidance on AI use in investment advice created new conflicts of interest disclosure requirements. And FINRA Rule 3110's supervision requirement applies to AI systems used in client-facing functions as fully as it does to human representatives.

If you're a broker-dealer or investment adviser using AI agents for client communication, suitability analysis, order routing, or research, the regulatory expectations are clear and increasingly examined.

<!-- truncate -->

## FINRA Rule 3110: Supervision

Every broker-dealer must establish and maintain a supervisory system reasonably designed to achieve compliance with applicable securities laws and FINRA rules. The system must include written supervisory procedures (WSPs) and designated supervisors.

For AI agents: the supervision obligation applies to AI-generated communications, AI-assisted suitability analysis, and AI-driven order routing in the same way it applies to registered representatives. Key implications:

**Written Supervisory Procedures must address AI**: If your AI agent generates recommendations or communications that go to clients, your WSPs must describe how that AI is supervised — not just that it exists.

**Review requirements**: Rule 3110 requires review of correspondence and internal communications. AI-generated content is correspondence. Your supervision system must include AI output review.

**Escalation procedures**: When the AI flags an issue, who handles it? The escalation path must be documented.

In the UAPK manifest context, the approval workflow section is the supervisory structure: who are the designated supervisors (approval roles), what action types require their review, and what is the escalation path.

## SEC Regulation Best Interest (Reg BI)

Reg BI requires broker-dealers to act in the best interest of retail customers when making recommendations. The SEC has been explicit: Reg BI applies to AI-generated recommendations.

For AI agents making investment recommendations:

1. **Disclosure obligation**: Must disclose material facts about the recommendation, including that it was AI-generated and any material conflicts of interest
2. **Care obligation**: The recommendation must reflect reasonable diligence, care, and skill — including understanding the customer's investment profile
3. **Conflict of interest obligation**: Must identify and manage or disclose conflicts — including any algorithmic tendency to favor higher-margin products

The audit log for an AI adviser must capture: what customer data was used, what the recommendation was, whether conflicts were identified and how they were handled.

## SEC AI-Washing Enforcement

The SEC's 2024 enforcement actions against "AI-washing" — falsely claiming AI capabilities in marketing materials — established that AI claims are material statements subject to the anti-fraud provisions of the securities laws.

For broker-dealers and advisers: if you tell clients your AI is providing personalized, best-interest analysis, it must actually be doing that. An AI that's optimizing for firm revenue while claiming to optimize for client outcomes is a potential fraud.

The connection to governance: the audit log is the evidence that your AI is doing what you say it does. Interaction records showing the AI's actual decision factors, compared against your marketing claims, is either your defense or the regulator's evidence.

## FINRA's 2024 AI Examination Focus Areas

FINRA's recent guidance identified these examination priorities for AI in securities:

1. **Algorithmic recommendations**: Is the algorithm tested for bias? Are testing methodologies documented?
2. **Customer communications**: Are AI-generated communications reviewed? Are disclosures adequate?
3. **Cybersecurity**: Are AI systems in scope for the firm's cybersecurity program?
4. **Books and records**: Are AI system configurations, prompts, and outputs preserved as required records?
5. **Vendor management**: If using third-party AI, is there adequate oversight of the vendor?

For item 4 — books and records — FINRA Rule 4511 requires broker-dealers to preserve records for 3 years (6 years for certain records). AI system configurations (manifests) and interaction records are records subject to these requirements. `audit_retention_days: 2190` (6 years) is the safe standard.

## The Investment Adviser Act Stack

For registered investment advisers (RIAs), the Investment Advisers Act of 1940 applies. The SEC's 2024 guidance specifically addressed:

**Predictive Data Analytics Rule (proposed 2023, finalized 2024)**: Advisers and broker-dealers must evaluate and neutralize or disclose conflicts of interest arising from the use of predictive data analytics technologies, including AI, that could place the firm's interests ahead of investors'.

This is a mandatory conflict-of-interest analysis for any AI system used in investor interactions. The analysis must be documented — and if conflicts exist that can't be neutralized, they must be disclosed.

**Form ADV disclosure**: RIAs must disclose their use of AI in Form ADV Part 2A if material to clients.

## UAPK for a Broker-Dealer AI Agent

```json
{
  "constraints": {
    "require_human_approval": ["recommendation:generate", "order:execute"],
    "audit_retention_days": 2190,
    "per_action_type_budgets": {
      "order:execute": 500
    }
  },
  "policy": {
    "jurisdiction_allowlist": ["US"],
    "tool_allowlist": [
      "market_data_feed",
      "suitability_engine",
      "order_management_system",
      "compliance_review"
    ],
    "require_capability_token": true,
    "approval_thresholds": {
      "action_types": ["order:execute"],
      "amount": 25000,
      "currency": "USD"
    }
  }
}
```

`require_human_approval` on `recommendation:generate` implements the Rule 3110 supervisor review requirement. Every AI recommendation goes through the supervision gate before it reaches a client.

`tool_allowlist` limited to compliance-reviewed tools prevents the AI from pulling data from unvetted sources that could introduce bias or conflict.

The interaction records are the books and records — capturing every recommendation the AI generated, what data it used, and whether a supervisor reviewed and approved it.
