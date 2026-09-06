---
slug: fedramp-ai-agents-federal-cloud-authorization
title: "FedRAMP and AI Agents: What Federal Cloud Authorization Means for Your AI Stack"
authors: [davidsanker]
tags: [fedramp, cmmc, defense, ai-governance, audit-logging, uapk-gateway]
date: 2026-04-17
description: "FedRAMP Rev. 5 authorization is required for cloud services used by federal agencies. Here's what AI agents and their infrastructure need to achieve and maintain FedRAMP authorization."
---

FedRAMP (Federal Risk and Authorization Management Program) Rev. 5 — aligned with NIST SP 800-53 Rev. 5 — is the authorization framework for cloud services used by US federal agencies. If your AI platform is used by a federal agency, or if you're building AI agents that operate on FedRAMP-authorized infrastructure, you're in this regulatory environment.

The 2024 FedRAMP authorization process reform has made the path somewhat faster for some providers. But the substantive requirements — particularly around logging, access control, and incident reporting — are unchanged and extensive.

<!-- truncate -->

## Who Needs FedRAMP

FedRAMP applies to Cloud Service Providers (CSPs) offering Infrastructure as a Service (IaaS), Platform as a Service (PaaS), or Software as a Service (SaaS) to federal agencies. Three authorization paths:

1. **Agency authorization** — a federal agency sponsors and authorizes the CSP
2. **JAB authorization** — the Joint Authorization Board (DoD, DHS, GSA) authorizes for broad government use
3. **FedRAMP Ready** — preliminary status showing readiness to pursue authorization

For AI platforms: if your SaaS product is sold to federal agencies, you need FedRAMP authorization. If you're a federal contractor building AI agents on top of FedRAMP-authorized infrastructure (AWS GovCloud, Azure Government, Google Cloud's FedRAMP-authorized services), you inherit the authorization boundary but must document what your application adds.

## NIST 800-53 Controls Relevant to AI Agents

FedRAMP Rev. 5 is built on 800-53 Rev. 5's control families. For AI agents, the most directly applicable:

**AC (Access Control)** — Role-based access, least privilege, account management. Capability tokens implement least privilege: agents get exactly the access declared in the manifest, no more.

**AU (Audit and Accountability)** — Event logging, log protection, review. FedRAMP Moderate baseline requires logging of authentication events, administrative actions, and security-relevant events. Every UAPK interaction record satisfies AU controls.

**CM (Configuration Management)** — Baseline configuration, change control, security impact analysis. The manifest is the agent's baseline configuration. Version control of manifests satisfies CM requirements.

**IA (Identification and Authentication)** — Multi-factor authentication, identifier management. Capability tokens are the AI agent's identity credential — cryptographically signed, with issuer identity embedded in the claims.

**IR (Incident Response)** — Incident handling, monitoring, reporting. FedRAMP requires incident reporting to US-CERT within 1 hour for major incidents. The audit log supports rapid incident characterization.

**SI (System and Information Integrity)** — Malicious code protection, security alerting, information input validation. The gateway's denylist enforcement and amount cap checks are input validation controls.

## The FedRAMP Logging Requirement

FedRAMP Moderate requires:

- Continuous monitoring of all systems
- Centralized log management
- Log retention for 3 years online, 3 additional years offline (6 total)
- Near-real-time alerts for security events
- Preservation of log integrity

For UAPK: `audit_retention_days: 2190` (6 years). The S3 COMPLIANCE-mode export with Object Lock provides the tamper-evident long-term storage. The hash chain provides integrity. Near-real-time alerts are built from anomaly detection over the interaction records stream.

## The Federal Cloud-Only Architecture

For FedRAMP-compliant AI deployments, the jurisdiction constraint is absolute:

```json
{
  "policy": {
    "jurisdiction_allowlist": ["US"],
    "tool_allowlist": [
      "fedramp_authorized_llm",
      "fedramp_authorized_datastore",
      "audit_evidence_store"
    ],
    "require_capability_token": true
  },
  "constraints": {
    "audit_retention_days": 2190
  }
}
```

`tool_allowlist` is limited to FedRAMP-authorized services. An AI agent operating in a federal boundary that uses a non-FedRAMP LLM or storage service is violating the authorization boundary — potentially invalidating the entire authorization.

This is a configuration management problem that the manifest solves at the architectural level. If `openai-api` is not in the tool allowlist, the agent cannot call OpenAI's API, regardless of what the upstream application requests. For federal deployments, only the GovCloud or FedRAMP In-Process variants of AI services should be listed.

## Continuous Monitoring (ConMon)

FedRAMP requires ongoing monitoring — not just a one-time assessment. CSPs must:

- Conduct monthly vulnerability scans
- Annually retest high-risk controls
- Submit monthly reports to authorizing agencies
- Report significant changes within 30 days

For AI agents, the interaction records are the continuous monitoring data source. Weekly review of deny rates, escalation rates, and budget utilization is the AI-specific ConMon process. Significant changes — manifest updates that expand agent capabilities — must be submitted for impact assessment.

## UAPK's Qualification for Federal Deployments

The qualification funnel recommends FedRAMP for `org_traits: ["federal_cloud_provider"]` — meaning organizations providing cloud services to federal agencies. CMMC 2.0 is also recommended for DoD contractors (`dod_contractor`). NIST CSF 2.0 and NIST AI RMF are recommended alongside both.

For federal deployments, this stack — FedRAMP + CMMC (if DoD) + NIST CSF + NIST AI RMF — represents the current comprehensive federal AI governance framework. The manifest questions for each framework surface the specific controls that differ between them.
