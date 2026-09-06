---
slug: sox-ai-financial-reporting-section-302-906
title: "SOX and AI Financial Reporting: What Sections 302, 404, and 906 Mean for Autonomous Agents"
authors: [davidsanker]
tags: [sox, sec-cyber, financial-services, ai-governance, audit-logging, human-in-the-loop, uapk-gateway]
date: 2026-04-09
description: "When an AI agent generates, reviews, or submits financial disclosures, SOX certifications still require human accountability. Here's how to structure that accountability into the agent layer."
---

SOX Section 302 requires the CEO and CFO to personally certify that financial reports are accurate and that they've reviewed the controls over financial reporting. Section 906 makes false certifications a criminal offense — up to 20 years in prison.

When an AI agent is generating financial reports, running disclosure checks, or preparing SEC filings, those certifications still apply. The executives signing them need to be able to vouch for the process that produced the numbers.

That's only possible if the AI's actions are auditable, the outputs are traceable to specific data sources, and a human reviewed the result before it was filed.

<!-- truncate -->

## The Three SOX Sections That Matter for AI

**Section 302 — Quarterly Certifications**
The CEO and CFO must certify:
- They reviewed the report
- It doesn't contain material misstatements or omissions
- The financial statements fairly present the company's condition
- They're responsible for internal controls and have evaluated their effectiveness

For an AI agent producing financial reports, "they reviewed" must be genuinely true — not "we reviewed the AI's summary of what it produced." The full output, with source data, must be reviewable.

**Section 404 — Internal Control Assessment**
Management must assess the effectiveness of internal controls over financial reporting (ICFR). Auditors must also attest to that assessment.

Any AI system involved in financial reporting is part of the ICFR. That means it must be documented, tested, and its controls must be assessed as part of the Section 404 evaluation.

**Section 906 — Criminal Liability**
False Section 302 certifications, if willfully made, carry criminal penalties. The "willful" standard has been interpreted broadly: if the executive had reason to know the controls were inadequate and certified anyway, that's willful.

Deploying an AI financial reporting agent without documented controls, then certifying the reports it produces, creates direct Section 906 exposure.

## What Controls Are Required

For an AI agent in financial reporting:

**Human approval before any disclosure**
Every financial disclosure — 10-K, 10-Q, 8-K, press release with financial data — must require human review and approval before submission. No AI agent should be able to file directly with the SEC.

```json
{
  "constraints": {
    "require_human_approval": ["report:submit", "report:generate", "audit:write"]
  }
}
```

**Audit trail of report generation**
The audit log must capture: what data the agent used, what transformations it applied, what the output was, and who reviewed and approved it before submission. This is the "effective review" that Section 302 certifications require.

**Retention for 7 years**
SOX requires financial records to be retained for 7 years. The interaction records — and the evidence bundles — should be retained to match: `audit_retention_days: 2555` (7 years).

**Tool restrictions**
The agent should only be able to access pre-approved financial data sources and submit to pre-approved endpoints. An agent that can pull data from unvetted sources and file with the SEC is not under adequate control.

```json
{
  "policy": {
    "tool_allowlist": ["financial_data_feed", "sec_edgar", "audit_evidence_store"],
    "jurisdiction_allowlist": ["US"],
    "require_capability_token": true
  }
}
```

## The SEC Cybersecurity Rule Stack

For public companies, SOX is increasingly paired with the SEC's 2023 Cybersecurity Disclosure Rule. That rule requires:

- Disclosure of material cybersecurity incidents within 4 business days on Form 8-K
- Annual disclosure of cybersecurity risk management, strategy, and governance in Form 10-K
- Board oversight of cybersecurity risk

If an AI agent is compromised — manipulated to produce false financial data, or its audit logs are tampered with — that's a material cybersecurity incident under the SEC rule. The 4-day disclosure clock starts when you determine it's material.

Your ability to make that determination quickly depends on your audit log. If you can't tell what the compromised agent did within 4 days, you can't file an accurate 8-K within 4 days.

UAPK's hash-chained audit log, combined with the evidence bundle export, is specifically designed for this scenario. You can pull a complete, cryptographically verified record of everything a specific agent did in a specific time period in minutes.

## The Dual Qualification

In the UAPK manifest builder, a US public company in financial services qualifies for SOX + SEC Cybersecurity Rule when:
- Geography: US
- Activities: financial_reporting
- Org traits: public_company

Both frameworks are recommended. The manifest questions for SOX focus on disclosure workflows, retention, and Section 404 documentation. The SEC Cyber questions focus on incident detection, log integrity, and disclosure processes. The resulting manifest satisfies both.

## Internal Controls Documentation

For Section 404, auditors will want to see documentation of the AI system's controls. The UAPK manifest itself is part of that documentation — it specifies, in machine-readable form, exactly what the agent is authorized to do, what it requires human approval for, and what data it can access. The version history of that manifest is part of your change management documentation.

When your external auditors ask "what controls do you have over the AI that generates your financial reports," you show them the manifest, the interaction records showing it operated within those controls, and the evidence bundle showing the chain is intact.
