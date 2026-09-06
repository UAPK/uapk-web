---
slug: dora-ai-agents-eu-financial-operational-resilience
title: "DORA and AI Agents: ICT Risk Management for EU Financial Entities"
authors: [davidsanker]
tags: [dora, nis2, financial-services, ai-governance, audit-logging, uapk-gateway]
date: 2026-04-14
description: "DORA's ICT risk management requirements apply to AI systems used by EU financial entities. Here's what third-party AI providers and in-house AI teams need to know."
---

DORA — the Digital Operational Resilience Act — became applicable on January 17, 2025. It applies to EU financial entities (banks, investment firms, insurance companies, payment institutions, crypto-asset service providers) and their critical ICT third-party service providers.

If you're an AI vendor providing services to EU financial institutions, or an EU financial institution running your own AI agents, DORA's ICT risk management framework applies to those AI systems.

<!-- truncate -->

## What DORA Covers

DORA has five pillars:

1. **ICT Risk Management** — policies, procedures, and tools to manage ICT risks
2. **ICT-Related Incident Management** — classification, reporting, and response
3. **Digital Operational Resilience Testing** — penetration testing, threat-led testing
4. **Third-Party Risk Management** — oversight of ICT service providers
5. **Information Sharing** — sharing threat intelligence across the financial sector

For AI agents, pillars 1, 2, and 4 are most directly relevant.

## ICT Risk Management for AI

DORA requires financial entities to maintain ICT risk management frameworks that include:

**Asset identification** — all ICT assets, including AI systems, must be inventoried. The manifest is the AI system's inventory record.

**Continuous monitoring** — operational performance of ICT systems must be monitored. For AI agents: every interaction goes through the gateway, producing a monitoring record.

**Backup and recovery** — ICT systems must have backup mechanisms. For AI governance: the audit log must be preserved and recoverable even if the primary system fails. UAPK's S3 COMPLIANCE-mode audit export satisfies this — once locked, records can't be deleted even by administrators.

**Change management** — changes to ICT systems must be controlled and documented. For AI agents: manifest version changes are the change management record.

**Business continuity** — financial entities must be able to continue operations during ICT disruptions. For AI agents: if the gateway goes down, what happens? The answer should be "the agent stops" — fail-closed, not fail-open.

## ICT Incident Management

DORA classifies ICT incidents and requires:

- **Major incidents** reported to competent authorities within initial 4-hour alert + detailed 72-hour report + final monthly report
- **Significant cyber threats** reported to competent authorities "without undue delay"

For an AI agent incident — the agent was compromised, manipulated into unauthorized actions, or experienced a data breach — the DORA reporting timeline is tight. The 4-hour initial alert requires that you know *something happened* within 4 hours.

That detection capability depends on your monitoring. UAPK's audit log produces an interaction record for every action. Anomaly detection on those records — unusual action patterns, jurisdiction violations, budget spikes — is the early warning system.

## Third-Party Risk Management

This is where AI vendors face direct DORA obligations. Financial entities must:

- Maintain a register of all ICT third-party service providers
- Conduct due diligence before entering contracts
- Include specific contractual provisions covering data security, audit rights, business continuity, and termination
- Conduct ongoing monitoring of third-party performance

For AI governance infrastructure providers: DORA's contractual requirements include audit rights. Financial institutions need the ability to audit their AI governance vendors. UAPK's self-hosted deployment option means the institution is both the financial entity and the infrastructure operator — no third-party audit requirement.

For SaaS AI governance: the institution must have contractual audit rights, and the vendor must support them.

## The NIS2 Stack

For EU financial entities that also qualify as "essential entities" under NIS2 (large banks, critical payment infrastructure operators, energy sector financial firms), DORA and NIS2 overlap significantly. Both require:

- Documented risk management
- Incident reporting to authorities
- Supply chain security
- Business continuity plans

The key difference: NIS2 covers a broader range of entities (not just financial), while DORA goes deeper on ICT-specific requirements for financial entities. For companies subject to both, DORA's requirements are generally the stricter standard and satisfying DORA typically satisfies NIS2 in the overlapping areas.

UAPK recommends both frameworks for EU financial entities in the qualification funnel. The manifest questions for each are distinct in areas where the regulations differ.

## The UAPK Manifest for a DORA-Compliant Agent

```json
{
  "constraints": {
    "audit_retention_days": 2555,
    "max_actions_per_hour": 500,
    "allowed_hours": {
      "start": "06:00",
      "end": "22:00",
      "timezone": "UTC"
    }
  },
  "policy": {
    "jurisdiction_allowlist": ["EU"],
    "require_capability_token": true
  }
}
```

`allowed_hours` limits agent activity to business hours — preventing automated activity during periods when monitoring staff are unavailable, which is a basic operational resilience control.

`audit_retention_days: 2555` (7 years) satisfies DORA's record retention requirements.

`require_capability_token: true` ensures every agent action is tied to an authorized issuer with a documented access grant — supporting DORA's ICT asset management and access control requirements.

## Penalties

DORA enforcement is by national competent authorities (the same regulators that supervise the financial institution). Penalties vary by member state but include:

- Fines up to 2% of total global annual turnover for financial entities
- Fines up to 1% of total global daily turnover for critical third-party providers
- Temporary suspension of critical ICT services
- Public disclosure

The ECB and EBA are actively supervising DORA implementation for significant institutions. The first enforcement actions under DORA are expected in 2025-2026.
