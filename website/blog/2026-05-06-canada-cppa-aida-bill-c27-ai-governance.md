---
slug: canada-cppa-aida-bill-c27-ai-governance
title: "Canada's Bill C-27: CPPA and AIDA — Privacy Reform and the First Canadian AI Law"
authors: [davidsanker]
tags: [data-privacy, ai-governance, qualification-funnel, policy-enforcement, uapk-gateway]
date: 2026-05-06
description: "Bill C-27 is Canada's most significant privacy and AI reform in decades. The Consumer Privacy Protection Act replaces PIPEDA, and the Artificial Intelligence and Data Act creates Canada's first AI-specific legal obligations."
---

Canada's Bill C-27 is moving through Parliament with two pieces that will affect any company operating AI in Canada: the Consumer Privacy Protection Act (CPPA) replacing PIPEDA, and the Artificial Intelligence and Data Act (AIDA) — Canada's first AI-specific legislation.

The CPPA modernizes Canadian privacy law along GDPR lines. AIDA creates obligations specifically for "high-impact" AI systems, with significant parallels to the EU AI Act's structure. For companies already navigating GDPR and the EU AI Act, the Canadian framework is familiar but has distinct elements.

<!-- truncate -->

## The Consumer Privacy Protection Act (CPPA)

CPPA replaces PIPEDA (Personal Information Protection and Electronic Documents Act) with a modernized framework that aligns more closely with GDPR while maintaining some Canadian distinctions.

### Key Changes from PIPEDA

**Explicit consent enhancements**: CPPA strengthens consent requirements — consent must be valid (meaningful, informed, free), and organizations must explain in plain language what data is collected, how it will be used, and who it will be shared with.

**Right to erasure**: CPPA adds a right to erasure (deletion) for personal information. For AI agents: the agent cannot process data that has been subject to a deletion request. This creates the same technical requirement as GDPR Article 17 and CCPA Section 1798.105 — deletion requests must propagate to AI agent data sources.

**Right to data portability**: CPPA requires organizations to provide personal information to individuals in a portable format. The audit log's records of what data an AI processed about an individual are in scope.

**Automated decision-making transparency**: Individuals have the right to request an explanation for predictions, recommendations, or decisions made using their personal information in an automated system. This is Canada's Article 22 equivalent.

**Privacy Management Program**: Organizations must implement a privacy management program proportionate to the volume and sensitivity of data handled. For AI agents: the governance framework (manifests, audit logs, approval workflows) is the technical implementation of the privacy management program's AI component.

**Penalty structure**: Fines up to CAD $25 million or 5% of global annual revenue for serious violations. For serious violations by organizations with high global revenue, this approaches GDPR-level exposure.

### The OPC's Role

The Office of the Privacy Commissioner of Canada (OPC) gains significant new enforcement powers under CPPA, including the ability to impose administrative monetary penalties and order organizations to stop processing. The current OPC guidance on AI (published 2023–2024) provides interpretive guidance on consent, automated decision-making, and de-identification that applies under both PIPEDA and CPPA.

## The Artificial Intelligence and Data Act (AIDA)

AIDA is the first Canadian statute specifically governing AI. It targets "high-impact AI systems" used in regulated activities, defining categories of regulated use and imposing obligations on both developers and deployers.

### High-Impact AI Systems

AIDA defines high-impact AI systems based on sector and effect:

- AI systems making consequential decisions affecting individuals in: employment, income, credit, housing, health services, law enforcement, immigration
- Systems that interact with large numbers of Canadians
- Systems whose malfunction could cause significant harm

The categories align roughly (but not precisely) with the EU AI Act's Annex III list. An AI agent making credit decisions, employment recommendations, or healthcare triage decisions qualifies under AIDA.

### Obligations for Deployers

**Accountability**: Deployers of high-impact AI systems must maintain governance documentation — who is responsible for the AI system, what risk assessments were conducted, what controls are in place.

**Risk assessment**: Before deploying a high-impact AI system, a risk assessment covering risks of harm is required. This must be updated when the system changes significantly.

**Risk mitigation**: Deployers must implement measures to mitigate risks identified in the assessment. The manifest configuration is the risk mitigation documentation.

**Incident reporting**: Where a high-impact AI system causes harm or is involved in an incident, reporting to the Minister is required.

**Record-keeping**: Records must be maintained demonstrating compliance with AIDA requirements. Retention periods are specified in regulations (not yet finalized).

### Obligations for Developers

AIDA also imposes obligations on organizations that develop AI systems:

- Assessments to identify and mitigate risks of biased output
- Testing against bias
- Publishing plain-language descriptions of AI system uses and limitations
- Maintaining anomalous-incident records

### The Regulator: ISED

The Department of Innovation, Science and Economic Development (ISED) administers AIDA. ISED can appoint an AI and Data Commissioner to administer the Act. Penalties are significant: up to CAD $25 million for serious violations; criminal offences for intentional use of AI to cause harm.

## AIDA vs. EU AI Act: Key Differences

| Issue | EU AI Act | Canada AIDA |
|-------|-----------|-------------|
| Structure | Prescriptive categories (prohibited, high-risk, limited-risk, minimal-risk) | Principles-based "high-impact" definition |
| Conformity assessment | Mandatory for high-risk | Risk assessment required (process TBD in regulations) |
| Prohibited AI | Explicit list | Not yet defined (to come in regulations) |
| General-purpose AI | Separate GPAI rules | Not covered yet |
| Extraterritorial scope | Applies to systems deployed in EU regardless of provider origin | Similar extraterritorial reach |

AIDA's specifics will be substantially shaped by regulations that haven't been finalized yet. Organizations should monitor ISED's consultations closely — the regulatory details will determine the practical compliance requirements.

## CPPA + AIDA: The Combined Compliance Stack

For an AI agent operating in Canada that makes consequential decisions:

```json
{
  "constraints": {
    "require_human_approval": [
      "decision:credit",
      "decision:employment",
      "decision:housing"
    ],
    "audit_retention_days": 1825
  },
  "policy": {
    "jurisdiction_allowlist": ["CA"],
    "tool_allowlist": [
      "credit_bureau_ca",
      "employment_verification_ca",
      "compliance_review"
    ],
    "require_capability_token": true
  },
  "metadata": {
    "aida_risk_assessment_ref": "AIDA-RA-2025-001",
    "privacy_management_program_ref": "PMP-AI-2025",
    "high_impact_categories": ["credit", "employment"]
  }
}
```

`require_human_approval` on `decision:credit`, `decision:employment`, and `decision:housing` implements both CPPA's automated decision-making transparency (a human reviewed the decision) and AIDA's risk mitigation requirement (consequential decisions have a human gate).

`audit_retention_days: 1825` (5 years) is a conservative retention period pending AIDA's final record-keeping regulations.

The metadata section links to the risk assessment and privacy management program documentation — the records required by AIDA and CPPA respectively.

## Timing

As of early 2026, Bill C-27 has passed the House of Commons and is in the Senate. Royal Assent followed by a transition period (likely 2–3 years for CPPA, regulations-dependent for AIDA) is the expected path.

Organizations operating in Canada should treat CPPA/AIDA compliance planning as a 2026–2027 priority. The framework requirements are known enough to start building governance infrastructure — and AIDA's risk assessment obligations apply to the system design phase, not just post-deployment.
