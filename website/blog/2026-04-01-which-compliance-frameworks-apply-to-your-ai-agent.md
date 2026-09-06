---
slug: which-compliance-frameworks-apply-to-your-ai-agent
title: "Which Compliance Frameworks Actually Apply to Your AI Agent?"
authors: [davidsanker]
tags: [ai-governance, qualification-funnel, regulatory-compliance, uapk-gateway]
date: 2026-04-01
description: "There are 39 compliance frameworks that could govern your AI agent. Four questions cut that list to the 5–8 that actually apply to your organization."
---

There are 39 compliance frameworks that could apply to your AI agent deployment. GDPR, HIPAA, MiCA, CMMC 2.0, LGPD, NIS2, DORA, SOX, the EU AI Act — the list keeps growing as regulators catch up to autonomous software.

The honest answer to "which ones apply to me?" is: almost certainly not all of them. A Brazilian e-commerce company processing Pix payments has almost nothing in common with a UK investment manager running algorithmic trades under MiFID II. But both will find themselves staring at the same overwhelming list if they don't have a way to filter it.

UAPK's compliance qualification funnel reduces 39 frameworks to the 5–8 relevant to your context using four questions. Here's how it works — and why those four questions are enough.

<!-- truncate -->

## The Four Questions

The funnel asks:

**1. Where do you operate?**
Geography is the highest-signal discriminator. GDPR applies if you process EU residents' data. HIPAA applies in the US. PIPL applies in China. LGPD applies in Brazil. Most regulatory frameworks are jurisdiction-first.

**2. What sector are you in?**
Financial services, healthcare, legal, crypto, defense, government — each has its own regulatory stack. A US healthcare SaaS company faces HIPAA + CCPA + SOC 2. An EU crypto exchange faces MiCA + AML + GDPR. Sector alone eliminates most of the irrelevant options.

**3. What does your agent actually do?**
Handling personal data triggers data privacy frameworks. Processing payments triggers AML and PCI-DSS. Making automated decisions about people triggers the EU AI Act. Touching health data triggers HIPAA. Serving children triggers COPPA. The activity profile narrows further.

**4. What kind of organization are you?**
Public company? SOX and SEC Cybersecurity Rule are mandatory. DoD contractor? CMMC 2.0 is non-negotiable. EU large company? CSRD applies. Fund manager? SFDR and MiFID II come into scope. Organizational traits trigger the last remaining frameworks.

## Why Four Questions Are Sufficient

Most compliance frameworks are defined by exactly these four dimensions — jurisdiction, sector, activity, and organizational type. The regulatory text says "entities processing personal data in the EU" (geography), "financial institutions" (sector), "automated credit decisions" (activity), or "issuers of asset-referenced tokens" (org type). The four questions map directly to how frameworks define their own scope.

What they don't ask: company size, budget, technical stack, number of employees. These affect *how* you implement compliance, not *which* frameworks apply.

## The Result

A typical mid-market company operating in the EU in financial services, handling personal data and automated decisions, comes out with:

- GDPR (EU + personal data)
- EU AI Act (EU + automated decisions)
- MiFID II (EU + financial services)
- DORA (EU + financial services)
- ISO 27001 (always recommended as baseline)
- SOC 2 (always recommended for SaaS)
- ISO 42001 (AI governance baseline)

That's 7 frameworks, not 39. Each one has a specific reason for being there, traceable back to one of the four answers.

## How UAPK Implements This

In the UAPK manifest builder, the qualification step runs before you ever see a framework list. The engine evaluates your four answers against trigger rules for each framework:

```json
"gdpr": [{"geographies": ["eu"]}],
"hipaa": [
  {"geographies": ["us"], "sectors": ["healthcare"]},
  {"geographies": ["us"], "activities": ["health_data"]}
],
"cmmc": [{"org_traits": ["dod_contractor"]}]
```

AND logic within each trigger, OR logic across triggers. ISO 27001 always fires — it's the baseline everyone needs.

The output is a pre-selected framework list in the manifest builder, which you can then add to, remove from, or replace entirely. The funnel is a starting point, not a constraint.

## Start With the Right Frameworks

Getting this wrong in either direction is costly. Too few frameworks and you're non-compliant. Too many and your engineers spend months answering questions that don't apply to your deployment context.

The qualification funnel in the UAPK manifest builder takes about 90 seconds to complete. The result is a defensible, traceable answer to "which frameworks apply to us" — with each selection backed by a specific trigger rule you can audit.
