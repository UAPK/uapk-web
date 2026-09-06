---
slug: ccpa-cpra-california-ai-agents-consumer-privacy
title: "CCPA/CPRA and AI Agents: California's Consumer Privacy Rights in Automated Systems"
authors: [davidsanker]
tags: [ccpa, data-privacy, ai-governance, policy-enforcement, uapk-gateway]
date: 2026-04-28
description: "CPRA's amendments to CCPA created new rights around automated decision-making and profiling that directly apply to AI agents processing California residents' data. Here's what changed and what you need."
---

The California Privacy Rights Act (CPRA) went into full effect January 1, 2023, amending and strengthening CCPA. Among the most significant additions for AI teams: explicit rights around automated decision-making and profiling — the closest the US has come, at the state level, to GDPR Article 22.

If your AI agents process personal information of California residents, CCPA/CPRA applies regardless of where your company is incorporated. California has approximately 39 million residents and is the fifth-largest economy in the world. Treat it as its own regulatory jurisdiction.

<!-- truncate -->

## What CPRA Added That CCPA Didn't Have

**Right to Opt Out of Automated Decision-Making (Section 1798.185(a)(16))**
The CPPC (California Privacy Protection Agency) has authority to issue regulations requiring businesses to provide opt-out rights for automated decision-making that produces legal or similarly significant effects. Draft regulations were issued in 2023 and finalized in 2024.

This creates a functional equivalent to GDPR Article 22, but framed as opt-out rather than opt-in. The practical implication: consumers must have a way to say "don't use automated systems to make decisions about me" — and your AI agent's processing path must respect that flag.

**Right to Access Automated Decision-Making Logic**
Consumers can request information about the logic underlying automated decisions, including profiling, and the likely outcome of that logic on their interests.

For AI agents: you must be able to explain, to any California consumer who asks, what automated process was used in decisions that affected them. This is an audit log requirement in practice — you need to have captured enough of the decision chain to provide that explanation.

**Sensitive Personal Information (SPI) Category**
CPRA created a new category with enhanced protections: SPI includes SSNs, driver's license numbers, financial account credentials, precise geolocation, racial/ethnic origin, religious beliefs, union membership, mail/email/text contents, genetic data, biometric data used for identification, health data, and sexual orientation/gender identity.

AI agents processing SPI have additional obligations: consumers can direct that SPI not be used for purposes beyond providing the requested service, and businesses must honor those restrictions.

**Purpose Limitation**
CPRA strengthened the requirement that personal information collected for one purpose not be repurposed without notice and opportunity to opt out. For AI agents: the declared purpose in the agent's manifest should match the actual use.

## The Opt-Out Infrastructure

The automated decision-making opt-out right creates a technical requirement: you must be able to flag individual consumers as opted out, and your AI agent must check that flag before processing their data in a decision context.

In the UAPK architecture, this is a counterparty-level control. An opted-out consumer is, in effect, a counterparty that should not receive certain processing:

```json
{
  "policy": {
    "counterparty_denylist": [],
    "require_capability_token": true
  },
  "constraints": {
    "require_human_approval": ["decision:profile", "recommendation:personalize"]
  }
}
```

The counterparty denylist can be dynamically updated to include opted-out consumer IDs (hashed, not in plaintext). Or the `require_human_approval` requirement on profiling actions means every profiling decision gets a human gate — which, combined with the opt-out check in the approval workflow, prevents automated profiling of opted-out consumers.

## The Delete/Correct/Portability Stack

CPRA gives California consumers four main rights that create technical requirements:

**Right to Delete (§1798.105)**: Must delete within 45 days of a verified request. For AI agents: the agent cannot access data marked for deletion. If the agent's tool allowlist includes a data store that has pending deletion requests, the access must be blocked or the deletion must be processed first.

**Right to Correct (§1798.106)**: Must correct inaccurate personal information within 45 days. For AI agents used in decisions: if a consumer corrects inaccurate data and requests that automated decisions using that data be reconsidered, you need a process for that.

**Right to Know (§1798.110/115)**: Consumers can request what data you have, where it came from, who you shared it with, and what you used it for. The audit log is the source of truth for the "what you used it for" part.

**Right to Portability (§1798.110)**: Consumers can request their data in a portable format. For AI agents that have built profiles or processed data: those outputs may be subject to portability requests.

## CPPA Enforcement

The California Privacy Protection Agency began formal enforcement actions in 2024. Early enforcement priorities:

- **Opt-out mechanisms**: particularly for automated decision-making and data sales
- **Privacy notices**: accurate disclosure of data practices, including AI/automated processing
- **Data minimization**: collecting more data than necessary

Fines are up to $2,500 per unintentional violation and $7,500 per intentional violation. For large-scale AI data processing, "per violation" can mean per consumer per incident — the math gets large quickly.

## CCPA vs. GDPR in Practice

For teams already compliant with GDPR, CCPA/CPRA adds these material differences:

- **Opt-out vs. opt-in**: CPRA uses opt-out for most purposes (GDPR requires opt-in for sensitive data)
- **Sale of personal information**: CPRA prohibits selling PI without opt-out; GDPR doesn't have a "sale" concept per se
- **No 72-hour breach notification**: California requires "expedient" notification with a 30-day guidance window
- **No DPO requirement**: CPRA doesn't require a dedicated Data Protection Officer

The common ground: both require audit trails, human oversight for automated decisions, data minimization, and the ability to respond to subject access requests. A UAPK manifest built for GDPR compliance satisfies most CCPA/CPRA requirements; the additions are the opt-out infrastructure and the sale/sharing disclosure obligations.
