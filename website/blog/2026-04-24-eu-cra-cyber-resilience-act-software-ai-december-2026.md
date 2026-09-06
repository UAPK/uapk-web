---
slug: eu-cra-cyber-resilience-act-software-ai-december-2026
title: "EU Cyber Resilience Act: What the December 2026 Deadline Means for AI Software Products"
authors: [davidsanker]
tags: [cra, eu-ai-act, ai-governance, audit-logging, uapk-gateway]
date: 2026-04-24
description: "The EU Cyber Resilience Act requires CE marking for software products with digital elements starting December 2027, with some obligations active earlier. AI-embedded software is in scope."
---

The EU Cyber Resilience Act (CRA) entered into force in December 2024. Most obligations apply from December 2027, but certain reporting requirements (vulnerability and incident reporting to ENISA) apply from September 2026. Products with digital elements — including AI-embedded software — are in scope.

If you're selling software into the EU that includes AI components, the CRA applies to your product. This is separate from the EU AI Act: the CRA covers cybersecurity; the AI Act covers AI governance. Both apply simultaneously to AI software sold in the EU.

<!-- truncate -->

## What the CRA Covers

The CRA applies to "products with digital elements" — essentially any software or hardware that connects to networks or other devices. That includes:

- Standalone software applications
- Software embedded in physical products (IoT)
- Software-as-a-Service (specific provisions)
- Components that other products incorporate

AI models and AI-powered software are products with digital elements. An AI governance platform, an AI document analysis tool, a trading algorithm — all are in scope.

**Critical products**: Certain categories face higher scrutiny (Annex I Class II and Class I). Class II critical products include security-relevant components like identity management software, VPNs, firewalls, and — notably — AI systems intended for critical infrastructure. These require third-party conformity assessments rather than self-assessment.

## Core CRA Security Requirements

The CRA mandates that products be:

**Designed and developed with security in mind** — including risk-appropriate security measures throughout the product lifecycle.

**Delivered without known vulnerabilities** — at the time of placement on market, products must not contain exploitable vulnerabilities in critical components.

**Securely configurable by default** — default configurations must be secure; insecure settings must require deliberate action to enable.

**Protected from unauthorized access** — using authentication, cryptographic mechanisms appropriate to the risk.

**Able to receive security updates** — manufacturers must be able to deliver security patches for the minimum support period (5 years for most products).

**Incident-reportable** — vulnerabilities exploited in the wild must be reported to ENISA within 24 hours (initial notification), with a more detailed report within 72 hours.

## How CRA and EU AI Act Interact

The two regulations have explicit coordination provisions:

- AI systems that are also high-risk under the EU AI Act follow the AI Act's conformity assessment pathway (the AI Act's CE marking serves for the CRA component)
- AI systems that are not high-risk under the AI Act but are in-scope for the CRA follow the CRA's conformity assessment pathway

The key distinction: the EU AI Act governs the AI's behavior and governance requirements; the CRA governs the cybersecurity of the software product itself.

For an AI governance platform like UAPK Gateway: the AI Act may not apply directly (UAPK is infrastructure for governing AI, not an AI making decisions about people), but the CRA applies to the software product.

## The December Timelines

| Date | CRA Obligation |
|------|---------------|
| September 2026 | Vulnerability and incident reporting to ENISA |
| December 2027 | Full CRA obligations, CE marking required |

The September 2026 reporting obligation is eight months away. If you're selling software to EU customers and haven't established a vulnerability disclosure program and ENISA reporting process, that's a near-term compliance gap.

The December 2027 full enforcement date gives more time for CE marking — but the conformity assessment process (especially for Class II products) takes 6–12 months. Companies that want to be compliant at the December 2027 deadline need to start the assessment process in early 2027 at the latest, which means having everything else in place by late 2026.

## What This Means for AI Software Sold in the EU

If your AI software is sold into the EU:

1. **Establish a vulnerability disclosure policy (VDP)** — required for ENISA reporting
2. **Set up ENISA notification process** — 24-hour initial notification capability for September 2026
3. **Document your security architecture** — required for conformity assessment
4. **Implement secure-by-default configurations** — audit trail, access controls, and encryption enabled by default, not opt-in
5. **Plan for CE marking** — which conformity pathway applies to your product?

For AI governance infrastructure: the audit log, hash-chain integrity, capability token authentication, and SSRF-protected connectors are the security architecture that the CRA conformity assessment will evaluate.

## Software Updates and Long-Term Support

The CRA's minimum 5-year support period is a product lifecycle requirement that many software companies haven't planned for. AI models become outdated; the software embedding them needs security updates.

For AI governance platforms, this means:
- Security patches must be delivered for 5 years from market placement
- The patch delivery mechanism must be secure (signed updates, integrity verification)
- Security vulnerabilities must be addressed and patches delivered in reasonable timelines

If a vulnerability is discovered in the UAPK Gateway that allows an attacker to bypass policy enforcement, that's a CRA-reportable incident and requires a patch within a reasonable timeframe. The signed-update mechanism is part of the CRA compliance requirement.
