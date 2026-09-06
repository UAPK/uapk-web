---
slug: eu-mdr-fda-medical-device-ai-samd
title: "EU MDR, FDA SaMD, and 21 CFR Part 11: AI Agents in Medical Devices and Clinical Software"
authors: [davidsanker]
tags: [hipaa, ai-governance, audit-logging, policy-enforcement, healthcare, uapk-gateway]
date: 2026-05-07
description: "Software as a Medical Device (SaMD) regulations from the FDA and EU MDR create some of the strictest requirements for AI systems in any sector. An AI agent making clinical recommendations faces obligations beyond HIPAA — here's the full picture."
---

If your AI agent touches clinical decision-making, diagnostic recommendations, treatment planning, or patient risk scoring, it may be classified as a Software as a Medical Device (SaMD). SaMD classification triggers regulatory requirements that are separate from and stricter than HIPAA — you're now in the FDA's jurisdiction (US) or EU MDR/IVDR jurisdiction (EU), not just privacy law territory.

The distinction matters because SaMD regulations aren't primarily about privacy. They're about safety: ensuring that software used in medical decisions is clinically validated, properly labeled, manufactured under quality controls, and doesn't cause patient harm when it behaves unexpectedly.

<!-- truncate -->

## What is SaMD?

The International Medical Device Regulators Forum (IMDRF) defines Software as a Medical Device as: "software intended to be used for one or more medical purposes that perform these purposes without being part of a hardware medical device."

An AI agent is likely SaMD if it:
- Analyzes patient data to detect, diagnose, or screen for disease
- Recommends treatment or medication dosing
- Predicts clinical risk (readmission risk, deterioration, mortality)
- Triages patients or prioritizes care
- Provides clinical decision support that drives specific clinical action

An AI agent is **not** SaMD if it is used for administrative functions (scheduling, billing, documentation) without influencing clinical decisions, or if it provides general health information without patient-specific clinical application.

## FDA Regulation of AI/ML SaMD

The FDA regulates medical devices under the Federal Food, Drug, and Cosmetic Act. Software that meets the SaMD definition requires either 510(k) clearance, De Novo classification, or PMA approval depending on its risk classification.

**The AI/ML Action Plan**: The FDA published its AI/ML-Based SaMD Action Plan in January 2021, establishing its approach to regulating AI that can adapt and change over time. The core challenge: traditional device clearance reviews a fixed device. AI models can drift, be retrained, and change behavior — the FDA needed a framework for governing that change.

**Predetermined Change Control Plans (PCCPs)**: The FDA's solution is to require manufacturers to submit PCCPs as part of device clearance. A PCCP describes the types of changes that can be made to the AI model post-clearance without requiring a new submission, along with the methods to implement and test those changes.

For AI agents: the manifest version control and change management process is the operational implementation of the PCCP philosophy. Changes to the AI agent's configuration (new tools, modified thresholds, updated approval workflows) are documented, tested, and version-controlled. The PCCP defines what changes require FDA re-notification; the manifest changelog is the evidence that changes were managed as committed.

**21 CFR Part 11: Electronic Records and Signatures**

Part 11 governs electronic records and signatures in FDA-regulated environments. Requirements:
- Electronic records must be trustworthy, reliable, and equivalent to paper records
- Computer systems must have validation documentation
- Audit trails must record creation, modification, or deletion of records with user identity and timestamp
- Access controls must limit record access to authorized users
- Electronic signatures must be unique to the individual and non-repudiable

For AI agents in FDA-regulated environments: the interaction record is an electronic record subject to Part 11. The requirements map directly:

| 21 CFR Part 11 Requirement | UAPK Implementation |
|---------------------------|---------------------|
| Trustworthy, reliable records | Ed25519 signatures + hash chain |
| Audit trail with user/timestamp | Interaction record: actor_id, timestamp, gateway_signature |
| Access controls | Capability tokens, require_capability_token |
| Non-repudiable signatures | Ed25519: private key is gateway-only, public key is published |
| Record retention | audit_retention_days configuration |

The hash chain (each record contains the SHA-256 hash of the prior record) satisfies Part 11's requirement that audit trails be protected against modification — breaking the chain is detectable.

## EU MDR and AI

EU MDR (Medical Device Regulation 2017/745) replaced the Medical Device Directive. It significantly tightened software regulation: Annex I (General Safety and Performance Requirements) now includes specific requirements for software, including:

- Software must be developed according to state-of-the-art development lifecycles
- Software must include risk management according to ISO 14971
- Software for serious conditions must be designed to prevent errors from incorrect data input

**GSPR Annex I, Chapter I, 17.2**: Software that drives clinical decisions must be designed to minimize risks resulting from incorrect software performance, including from misuse.

For AI agents: `require_human_approval` on clinical recommendations implements the "minimize risks from misuse" requirement — a human clinician reviews the AI recommendation before it drives a clinical decision. The approval record documents that the safeguard was applied.

**MDR Technical Documentation (Annex II)**: The technical file for an AI SaMD must include a description of the software, including the algorithm and performance characteristics, and documentation of the software's clinical evaluation. The manifest is part of this technical documentation — it describes the agent's authorized scope, constraints, and tools.

## IVDR: In Vitro Diagnostics

If your AI agent analyzes laboratory data, genomic data, or biomarkers to make diagnostic conclusions, it may fall under the In Vitro Diagnostic Regulation (IVDR 2017/746) instead of MDR. IVDR has stricter performance requirements and requires notified body review for higher-risk IVDs.

AI-powered genetic interpretation, laboratory result analysis, and biomarker-based risk scoring have all been subjects of IVDR classification discussions with notified bodies.

## The International Framework: IMDRF SaMD Levels

IMDRF classifies SaMD by two dimensions: the severity of the condition and the significance of the information provided (inform/drive/diagnose):

| Significance | Critical Condition | Serious Condition | Non-Serious |
|-------------|-------------------|-------------------|-------------|
| Treat/diagnose | SaMD Level IV | SaMD Level III | SaMD Level II |
| Drive clinical mgmt | SaMD Level III | SaMD Level II | SaMD Level I |
| Inform clinical mgmt | SaMD Level II | SaMD Level I | SaMD Level I |

Higher SaMD levels require more rigorous clinical evaluation and more stringent quality management. An AI agent making autonomous treatment recommendations for critical conditions (Level IV) faces the strictest requirements.

## Combined Compliance for US Health AI Agents

A US-deployed AI agent for clinical decision support faces this regulatory stack:

- **HIPAA** — PHI protection, minimum necessary, BAA with AI providers
- **FDA SaMD** — 510(k)/De Novo clearance, PCCP, quality management
- **21 CFR Part 11** — Electronic records, audit trails, access controls
- **ISO 13485** — Medical device quality management system
- **ISO 14971** — Medical device risk management

```json
{
  "constraints": {
    "require_human_approval": [
      "clinical:recommend",
      "diagnosis:generate",
      "medication:suggest",
      "risk:score"
    ],
    "audit_retention_days": 2555
  },
  "policy": {
    "jurisdiction_allowlist": ["US"],
    "tool_allowlist": [
      "ehr_read_only",
      "clinical_guidelines_db",
      "drug_interaction_checker",
      "compliance_review"
    ],
    "require_capability_token": true
  }
}
```

Every clinical output is behind `require_human_approval`. This satisfies: HIPAA's minimum necessary principle (the physician confirms appropriateness), FDA's PCCP risk management (human oversight as a risk control), Part 11's access control (only credentialed approvers can release clinical outputs), and GSPR Annex I (risk minimization through human oversight).

`audit_retention_days: 2555` (7 years) covers the FDA's device record retention requirement (2 years post-distribution for most devices, but quality records are typically kept 7 years).

The `ehr_read_only` tool in the allowlist enforces that the AI reads but does not write to the EHR — clinical decisions are made by humans, documented by humans. The AI is advisory, not autonomous, in the clinical context.
