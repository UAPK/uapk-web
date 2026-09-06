---
slug: iso-27001-ai-agents-isms-information-security
title: "ISO 27001 and AI Agents: Why It's the Baseline for Every Deployment"
authors: [davidsanker]
tags: [iso-27001, soc2, ai-governance, audit-logging, policy-enforcement, uapk-gateway]
date: 2026-04-20
description: "ISO 27001 is the one framework recommended for every AI agent deployment regardless of geography, sector, or activity. Here's why — and what the most relevant controls mean in practice."
---

The UAPK qualification funnel has a single framework that triggers for every deployment, regardless of answers: ISO 27001. It's not a coincidence. ISO 27001 is the information security management baseline that every other framework assumes you have in place.

GDPR references ISO 27001 as a baseline security measure. The EU AI Act's technical standards bodies have referenced it. HIPAA's Security Rule was modeled on its structure. SOC 2's Trust Service Criteria map directly to ISO 27001 domains. If you're going to comply with any specialized framework, you need ISO 27001 as the foundation.

<!-- truncate -->

## What ISO 27001 Is (and Isn't)

ISO 27001 is a management system standard — it specifies requirements for establishing, implementing, maintaining, and continually improving an Information Security Management System (ISMS). Annex A provides 93 controls organized into four themes: Organizational, People, Physical, and Technological.

It is *not* a checklist of specific technical settings. The standard specifies that you have a systematic process for managing information security risks — what that process looks like depends on your context.

For AI agents, this context-dependence is a feature: the standard requires you to identify your specific risks, select controls appropriate to those risks, and document why you made those choices. The manifest is that documentation.

## The Annex A Controls Most Relevant to AI Agents

**A.5.22 — Information Security for Use of Cloud Services**
Requirements for using and managing cloud services, including security responsibilities in cloud relationships. For AI agents using cloud LLMs or APIs: documented assessment of the security controls provided by the cloud provider vs. what you're responsible for.

**A.5.33 — Protection of Records**
Records must be protected from loss, destruction, falsification, unauthorized access, and unauthorized release. For AI agents: the hash-chained audit log is the technical implementation. The tamper-evidence mechanism directly satisfies this control.

**A.8.15 — Logging**
Activity logs recording user activities, exceptions, faults, and information security events must be produced, stored, protected, and analyzed. For AI agents: every interaction record satisfies A.8.15. The records include: agent identity, action type, tool, parameters, policy decision, timestamp.

**A.8.16 — Monitoring Activities**
Networks, systems, and applications must be monitored for anomalous behavior. For AI agents: deny rate monitoring, escalation rate monitoring, and budget utilization monitoring are the anomaly detection mechanisms.

**A.8.18 — Use of Privileged Utility Programs**
Use of utility programs that can override system and application controls must be restricted and tightly controlled. For AI agents: the capability token system implements privileged access control. Tokens have specific action type authorizations, expiry dates, and max action counts — they're the "privileged access" credential.

**A.8.21 — Security of Network Services**
Security mechanisms, service levels, and management requirements of network services must be identified, implemented, and monitored. For AI agents: the SSRF protection in the gateway's HTTP connector prevents agents from being used to make unauthorized internal network requests.

## The ISMS Scope for AI Agents

ISO 27001 requires you to define the scope of your ISMS. For AI agents, the scope question is: what assets, processes, and information are within scope of this management system?

The manifest defines this precisely:
- Assets: the agent, its capabilities, its tools
- Processes: the actions the agent takes
- Information: the data types it processes (from the data governance section)

The manifest version history, capability token issuance logs, and interaction records together constitute the ISMS evidence for the AI agent's scope of activity.

## SOC 2 and ISO 27001

SOC 2 Type II is the US market equivalent to ISO 27001 in terms of market recognition, particularly for SaaS companies. The Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) map closely to ISO 27001's Annex A controls.

UAPK recommends both. For US-facing companies, SOC 2 Type II is often the more practical certification for sales and procurement purposes. For EU-facing companies, ISO 27001 is often required by enterprise customers. For global companies, maintaining both is the norm.

The UAPK manifest questions for ISO 27001 and SOC 2 overlap significantly — the controls are similar, the documentation differs. Answering both sets of framework questions in the manifest builder produces a compliance posture that covers both certifications.

## ISO 27701: The Privacy Extension

ISO 27701 extends ISO 27001 to cover privacy information management — specifically the PIMS (Privacy Information Management System). It's designed to serve as evidence of GDPR and LGPD compliance.

For organizations subject to GDPR or LGPD that already have ISO 27001: adding ISO 27701 is a natural extension. The controls it adds are specifically about personal data handling, consent management, and data subject rights — exactly the additional controls that GDPR and LGPD require beyond basic information security.

UAPK recommends ISO 27701 when both ISO 27001 and a data privacy framework (GDPR or LGPD) are in scope. It's the bridge between information security and privacy compliance.

## Certification vs. Compliance

ISO 27001 can be:
1. **Certified**: formal third-party audit, UKAS/accredited certification body, certificate issued
2. **Compliant**: implementing the controls, no formal audit, self-attestation

Most enterprise procurement processes now require at least SOC 2 Type II, and increasingly ISO 27001 certification (not just compliance). For B2B SaaS serving regulated industries, the certification differentiates you from competitors that only claim compliance.

The UAPK manifest + interaction records + evidence bundle are the documentation that an ISO 27001 certification audit uses. You're not assembling compliance evidence for an audit — you're operating in a way that continuously produces audit evidence as a byproduct of normal operations.
