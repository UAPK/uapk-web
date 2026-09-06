---
slug: cmmc-dod-ai-agents-controlled-unclassified-information
title: "CMMC 2.0 and DoD AI Agents: Protecting CUI Without Slowing Down Operations"
authors: [davidsanker]
tags: [cmmc, defense, ai-governance, audit-logging, policy-enforcement, uapk-gateway]
date: 2026-04-10
description: "CMMC 2.0 is now required for DoD contracts. Here's what Level 2 and Level 3 requirements mean for AI agents handling Controlled Unclassified Information."
---

CMMC 2.0 is no longer proposed — it's in the Federal Register and is being phased into DoD contracts through 2026. If you're a defense contractor that uses AI agents to handle Controlled Unclassified Information (CUI), you need CMMC compliance baked into those agents.

The consequence of getting this wrong isn't a fine. It's losing your DoD contracts.

<!-- truncate -->

## CMMC 2.0 Structure

CMMC 2.0 has three levels:

- **Level 1 (Foundational)**: 17 practices, self-assessment, for Federal Contract Information (FCI) only
- **Level 2 (Advanced)**: 110 practices from NIST SP 800-171, third-party assessment for most CUI contracts
- **Level 3 (Expert)**: 110+ practices from NIST SP 800-172, government-led assessment for highest-priority CUI

Most defense contractors handling CUI need Level 2. Level 3 applies to the programs that support critical national security capabilities.

## What NIST SP 800-171 Requires for AI Agents

CMMC Level 2 is built on 800-171's 14 control families. Several directly govern AI agent behavior:

**Access Control (AC)**
Only authorized users can access CUI. For AI agents: only authorized agents with documented, current capability tokens can access CUI systems. `require_capability_token: true` in the manifest is the implementation.

**Audit and Accountability (AU)**
Create, protect, and retain audit logs. For AI agents: every CUI access must be logged, the logs must be tamper-evident, and they must be retained for 3 years (DoD standard). `audit_retention_days: 1095`.

**Configuration Management (CM)**
Establish baseline configurations and control changes. For AI agents: the manifest is the baseline configuration. Any change to capabilities, policy, or constraints is a configuration change that requires documentation and approval.

**Identification and Authentication (IA)**
Authenticate users and devices. For AI agents: the agent must present a valid capability token signed by an authorized issuer. Invalid or expired tokens result in immediate denial.

**System and Communications Protection (SC)**
Protect CUI at rest and in transit. For AI agents: the gateway enforces that CUI can only be accessed through pre-approved tools and transmitted to pre-approved counterparties.

## The CUI-Specific Manifest

```json
{
  "constraints": {
    "require_human_approval": ["data:read", "report:generate", "scan:system"],
    "audit_retention_days": 1095,
    "max_actions_per_day": 200
  },
  "policy": {
    "jurisdiction_allowlist": ["US"],
    "tool_allowlist": [
      "cui_document_store",
      "nist_assessment_tool",
      "cmmc_scorecard",
      "audit_evidence_store"
    ],
    "require_capability_token": true,
    "approval_thresholds": {
      "action_types": ["data:read", "report:generate", "scan:system"]
    }
  }
}
```

Every CUI access requires human approval. The jurisdiction is locked to US — no CUI can flow to foreign counterparties, which would trigger ITAR/EAR violations on top of CMMC. The tool allowlist prevents the agent from accessing CUI through unapproved systems. `require_capability_token: true` means every access is tied to an authorized issuer, providing the chain-of-custody documentation CMMC requires.

## The Third-Party Assessment

For Level 2, a C3PAO (CMMC Third-Party Assessment Organization) will assess your implementation of the 110 practices. For AI agents, the assessors will look at:

1. **Is there documented evidence of what the AI does?** — The manifest is that documentation
2. **Are access controls enforced?** — Capability tokens + gateway deny logs
3. **Is there an audit trail?** — Interaction records with hash chain
4. **Can you demonstrate the controls work?** — The deny logs showing the gateway blocked unauthorized access attempts

The audit evidence bundle, exported from UAPK, is designed to answer all four questions. C3PAOs increasingly expect cloud-native evidence in addition to paper documentation. A tamper-evident, cryptographically signed log bundle is more defensible than an exported spreadsheet.

## NIST AI RMF Alongside CMMC

DoD contractors using AI increasingly face NIST AI RMF requirements from DoDI 3000.09 (autonomous weapons systems policy) and broader DoD AI ethics guidelines. NIST AI RMF's four functions — Govern, Map, Measure, Manage — align well with UAPK's architecture:

- **Govern**: The manifest is the AI system's governance document
- **Map**: The qualification funnel maps risks (frameworks) to the deployment context
- **Measure**: Interaction records measure what the AI actually does against policy
- **Manage**: The policy engine manages risk at runtime; human approval manages escalations

UAPK's qualification funnel recommends CMMC + NIST CSF + NIST AI RMF together for DoD contractors. The three frameworks are complementary: NIST CSF covers cybersecurity controls, CMMC Level 2 operationalizes those controls for CUI, and NIST AI RMF governs the AI-specific risk dimensions.

## Personal Liability

CMMC 2.0 includes self-attestation requirements for Level 1 and Level 2. Executives signing self-assessments are personally accountable for their accuracy. False attestations are subject to False Claims Act liability — up to three times the damages plus civil penalties.

This is the same personal liability structure as SOX Section 906. The pattern is consistent across regulation: as AI systems take on higher-stakes functions, regulators are attaching personal accountability to the humans who sign off on them.
