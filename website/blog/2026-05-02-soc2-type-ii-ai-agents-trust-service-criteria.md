---
slug: soc2-type-ii-ai-agents-trust-service-criteria
title: "SOC 2 Type II and AI Agents: What Auditors Actually Look For"
authors: [davidsanker]
tags: [soc2, iso-27001, ai-governance, audit-logging, policy-enforcement, uapk-gateway]
date: 2026-05-02
description: "SOC 2 Type II is the US SaaS buyer's primary trust benchmark. For AI agents, the audit covers not just your infrastructure controls but the behavioral controls on what the AI can actually do."
---

SOC 2 Type II is the most requested security certification in US enterprise software procurement. If your SaaS product touches customer data and you're selling to mid-market or enterprise buyers, you'll eventually get asked for a SOC 2 Type II report. For AI-native products, auditors are increasingly asking about AI-specific controls — not just the usual infrastructure checklist.

The difference between SOC 2 Type I and Type II matters: Type I says your controls are designed correctly as of a point in time. Type II says those controls operated effectively over a period of time (typically 6–12 months). The audit period is everything. An AI agent that behaved correctly in January means nothing if it went rogue in July and you have no logs to show it didn't.

<!-- truncate -->

## The Trust Service Criteria

AICPA's Trust Service Criteria (TSC) are the control categories SOC 2 audits evaluate. The five TSC:

1. **Security** (CC series) — required in every SOC 2 audit
2. **Availability** (A series) — system available as committed
3. **Processing Integrity** (PI series) — processing is complete, accurate, timely, authorized
4. **Confidentiality** (C series) — confidential information is protected
5. **Privacy** (P series) — personal information handled per privacy notice

Most enterprise SaaS products include Security and Availability. Products handling sensitive data typically add Confidentiality. Products making autonomous decisions should include Processing Integrity. Products with personal data should include Privacy.

For AI agents: Processing Integrity (PI 1.1 — processing is complete and accurate) is the criteria category that directly addresses whether the AI did what it was supposed to do.

## CC6: Logical Access Controls

CC6 (Logical and Physical Access Controls) governs who and what can access systems. For AI agents, the relevant sub-criteria:

**CC6.1**: Logical access security measures are implemented to restrict access to information assets.

For AI agents: the tool allowlist is the access control. An AI agent that can only call the tools declared in its manifest is operating under CC6.1 controls — it cannot access systems outside its declared scope.

**CC6.6**: Logical access security measures restrict access from outside the entity's boundaries.

For AI agents: jurisdiction controls and counterparty denylists restrict which external parties the AI can interact with. These are CC6.6 controls.

**CC6.7**: The transmission, movement, and removal of information is restricted to authorized processes.

For AI agents: require_capability_token ensures that only properly credentialed processes can submit actions to the gateway. Unsigned or unauthenticated requests are rejected before they affect any data.

The audit evidence for CC6: the manifest (what access was authorized), the gateway evaluation records (what was requested and whether it was permitted), and the deny records (what was blocked).

## CC7: System Operations

CC7 governs monitoring and detection. This is where AI governance most directly shows up in a SOC 2 audit.

**CC7.1**: Detection controls identify deviations from expected processing patterns.

For AI agents: anomaly detection over the interaction records. If an agent suddenly makes 500 requests per hour when its normal pattern is 20, that deviation should be detected. The audit log with rate limiting data is the detection mechanism.

**CC7.2**: Remediation controls identify and correct threats.

For AI agents: require_human_approval on high-risk actions is a remediation control — it puts a human in the loop before the AI can take actions that could cause harm. The approval workflow records who reviewed and what they decided.

**CC7.3**: Security events are identified and responded to through a defined response process.

The audit log's evidence bundle — including the hash chain and Ed25519 signatures — is the documentation of security events. The retention policy (audit_retention_days) ensures these records are available throughout the audit period and beyond.

## CC9: Risk Mitigation

**CC9.2**: The entity assesses and manages risks associated with third-party vendors.

For AI agents: the AI model provider is a vendor. The AI governance platform (if SaaS) is a vendor. A self-hosted governance layer with no external dependencies reduces vendor risk. The manifest's tool allowlist documents the specific external services the AI is permitted to call — and that list is the scope of your vendor risk assessment.

## Processing Integrity for AI

PI 1.1 requires that system processing is complete, valid, accurate, timely, and authorized. For AI agents making decisions:

- **Complete**: Was every required step executed? The approval workflow record shows whether human review happened when required.
- **Accurate**: Did the AI use the right data? The interaction record shows what inputs the AI received and what it returned.
- **Authorized**: Was the action permitted under the policy? The gateway evaluation record shows which policy check fired and what decision was made.

An AI agent without governance infrastructure cannot satisfy PI 1.1. "The AI made a decision" is not auditable evidence. "The AI received these inputs, evaluated them against this policy, and was approved by this named individual at this timestamp" is.

## Type I vs. Type II: The Operational Gap

Most AI teams focus on getting controls designed correctly (Type I). The Type II audit period — where those controls must operate continuously — is where AI governance gets harder.

The SOC 2 Type II failure mode for AI: controls are designed in January (Type I report looks good), but the manifest is never updated when new tools are added, approval workflows are bypassed under operational pressure, or log retention is shortened to save storage costs. By December, the audit shows controls weren't operating as designed.

The manifest version history and change log is the evidence that your governance framework wasn't just designed correctly — it was maintained correctly. Each manifest update with a dated change log entry demonstrates operational discipline over the audit period.

## SOC 2 vs. ISO 27001: Which to Get First

US buyers ask for SOC 2. European buyers ask for ISO 27001. The practical answer for most companies:

- US-focused SaaS: SOC 2 Type II first, ISO 27001 later
- EU-first or global: ISO 27001 first, SOC 2 as US market grows
- Enterprise with both markets: get both (substantial control overlap reduces the marginal cost of the second)

The control overlap is real. ISO 27001 Annex A controls A.8.15 (logging), A.5.23 (cloud services), A.5.36 (compliance) map directly to SOC 2 CC7, CC9, and Privacy criteria. A company with mature ISO 27001 can typically achieve SOC 2 in one audit cycle rather than two.

## The UAPK Evidence Package for SOC 2

```json
{
  "constraints": {
    "audit_retention_days": 365,
    "require_human_approval": ["data:export", "config:modify", "user:delete"]
  },
  "policy": {
    "tool_allowlist": [
      "customer_database",
      "analytics_platform",
      "notification_service"
    ],
    "require_capability_token": true
  }
}
```

For a SOC 2 Type II audit package:

- **Manifest + version history** → CC6 evidence (access controls designed and maintained)
- **Gateway evaluation records** → CC7 evidence (monitoring operational throughout audit period)
- **Approval workflow records** → CC7 + PI 1.1 evidence (human oversight of high-risk actions)
- **Deny records** → CC6 evidence (unauthorized access blocked)
- **Hash chain + signatures** → integrity evidence (logs weren't modified after the fact)

`audit_retention_days: 365` ensures records span the full audit period. For subsequent audit cycles, consider 730 days (2 years) so records from the prior period are available to auditors reviewing continuity.
