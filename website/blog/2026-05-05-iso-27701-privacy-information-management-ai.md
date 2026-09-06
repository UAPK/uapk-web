---
slug: iso-27701-privacy-information-management-ai
title: "ISO 27701: Privacy Information Management for AI Systems"
authors: [davidsanker]
tags: [iso-27001, gdpr, data-privacy, ai-governance, audit-logging, uapk-gateway]
date: 2026-05-05
description: "ISO/IEC 27701:2019 extends ISO 27001 with privacy-specific controls. It's the certification path for demonstrating GDPR Article 5 compliance and is the closest thing to an international privacy management standard."
---

ISO/IEC 27701:2019 extends ISO 27001 with a Privacy Information Management System (PIMS). It adds privacy-specific clauses and controls on top of the ISO 27001 management system, mapping to GDPR, CCPA, and other major privacy regulations.

For organizations already certified to ISO 27001, adding ISO 27701 extends the existing management system rather than building a new one. The incremental effort is roughly 30–50% of the original ISO 27001 implementation, depending on how mature your privacy practices already are.

For AI systems that process personal data, ISO 27701 is the most rigorous international framework for demonstrating privacy compliance. The EU Commission has indicated that ISO 27701 certification can support GDPR adequacy assessments and serve as evidence of compliance under GDPR Article 5.

<!-- truncate -->

## What ISO 27701 Adds

ISO 27001 covers information security: confidentiality, integrity, availability of information assets. ISO 27701 adds privacy as a dimension: the lawfulness, fairness, transparency, purpose limitation, data minimisation, accuracy, storage limitation, and accountability requirements of GDPR Article 5.

The structure:
- **Clause 6–8 extensions**: Privacy-specific extensions to the planning, support, and operations clauses of ISO 27001
- **Annex A**: Controls for PII controllers (organizations that determine the purpose and means of processing)
- **Annex B**: Controls for PII processors (organizations that process data on behalf of controllers)
- **Annex D**: Mapping to GDPR (Articles 5, 6, 7, 9, 12–23, 28, 30, 32–36)
- **Annex E**: Mapping to ISO 29100 (privacy framework)

AI agents typically operate as either controllers (when the agent is making decisions about individuals on behalf of the deploying organization) or processors (when the agent is processing data the controller already holds, on the controller's instructions). The distinction matters for which Annex A vs. Annex B controls apply.

## Key Controls for AI Agents

**A.7.2.1 (PII Controller): Identify and document purpose**

The organization must identify and document the purpose(s) for which PII is processed. For AI agents: the manifest's declared capabilities and tool allowlist define the processing scope. An AI agent permitted to access `customer_profile_db` and `recommendation_engine` has a documented processing scope. Accessing tools outside the allowlist is blocked — which means processing outside the documented purpose is technically prevented, not just policy-prohibited.

**A.7.2.3: Determine lawful basis**

The processing must have a lawful basis under GDPR Article 6. For AI agents making automated decisions: the lawful basis (consent, contract, legitimate interest) must be documented and available for inspection. The manifest metadata section can reference the lawful basis documentation.

**A.7.4.1: Limit collection to what's necessary**

Data minimisation requires that only the minimum necessary personal data is collected. For AI agents: tool allowlist constraints limit what data sources the agent can access. An agent that can only read customer name and order history for a recommendation task — not their full financial profile, health data, or communications — is implementing data minimisation at the architectural level.

**A.7.4.7: Accuracy and quality**

PII must be accurate and where necessary kept up to date. For AI agents making decisions based on PII: the decision record must capture what data was used, enabling corrections to be applied if the data is later found to be inaccurate (the CPRA right to correct and GDPR Article 16 right to rectification).

**A.7.4.8: Erasure and destruction**

When PII is no longer needed, it must be erased. For AI agents: data accessed during an interaction must not be retained beyond its purpose. The `audit_retention_days` setting governs how long interaction records are kept — and those records should not contain PII beyond what's necessary for the audit purpose.

**A.7.5.1: Privacy notice**

Individuals must be informed about processing. For AI agents: if the agent makes decisions about individuals, those individuals must be informed that AI is involved. The interaction record captures whether disclosure was made.

**A.7.5.2: Rights of individuals (access, correction, erasure)**

Organizations must have processes to respond to rights requests. For AI agents: the audit log is the data source for subject access requests — it's the record of what automated processing was applied to an individual's data.

**A.7.5.4: Automated decision-making**

This control directly addresses AI: the organization must implement additional safeguards when making automated decisions with legal or similarly significant effects. The `require_human_approval` constraint is the control implementation — and the audit log demonstrates that human approval was obtained before significant automated decisions were acted upon.

## GDPR Article 35: Data Protection Impact Assessment

ISO 27701 requires organizations to conduct Data Protection Impact Assessments for high-risk processing (Annex A.7.2.7). GDPR Article 35 requires DPIAs for processing that is "likely to result in a high risk to the rights and freedoms of natural persons."

Automated decision-making with significant effects is explicitly listed as requiring a DPIA under GDPR Article 35(3)(a).

The DPIA for an AI agent documents:
1. Description of the processing and its purposes
2. Assessment of necessity and proportionality
3. Assessment of risks to individuals
4. Measures to address those risks

The UAPK manifest is the technical documentation of the risk mitigation measures: human approval controls, jurisdiction restrictions, tool allowlists, and audit retention are all DPIA control measures.

## ISO 27701 and Cross-Border Transfers

GDPR restricts personal data transfers to countries outside the EEA unless adequate protection is in place. ISO 27701 Annex A.7.5.3 covers transfers to third countries.

For AI agents: if the agent sends personal data to tools or APIs outside the EEA, the jurisdiction controls must account for this. `jurisdiction_allowlist: ["EU"]` isn't enough if a tool in the allowlist is hosted in a non-EEA country. The tool allowlist review must consider where each tool's data processing occurs.

## The Three-Framework Stack

For organizations subject to GDPR that want a comprehensive international compliance posture:

| Framework | What it covers |
|-----------|---------------|
| ISO 27001 | Information security management (Annex A: 93 controls) |
| ISO 27701 | Privacy information management (extends 27001) |
| ISO 42001 | AI management system (AI-specific governance) |

This stack addresses security (27001) + privacy (27701) + AI governance (42001) in integrated management systems with shared infrastructure: one management review, one internal audit, one corrective action process. The UAPK audit log and manifest are evidence across all three.

## Certification Path

ISO 27701 requires existing ISO 27001 certification (or concurrent certification). The audit is conducted by the same certification body, covering the combined scope of the ISMS + PIMS.

Timeline: organizations typically certify to ISO 27001 first (6–12 months from start to certification), then add ISO 27701 in the next certification cycle (3–6 months additional). Concurrent implementation is possible if starting from scratch on both.

For AI-specific companies, adding ISO 42001 at the same time as ISO 27701 makes sense — the overlap in management system infrastructure means the combined effort is less than three separate implementations.

The UAPK manifest history and interaction records serve as evidence for all three frameworks. The governance infrastructure doesn't need to change — the evidence it produces maps to multiple standards simultaneously.
