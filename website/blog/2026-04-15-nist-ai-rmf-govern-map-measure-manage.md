---
slug: nist-ai-rmf-govern-map-measure-manage
title: "NIST AI RMF in Practice: Using Govern, Map, Measure, Manage to Structure Your AI Agent Policy"
authors: [davidsanker]
tags: [nist-ai-rmf, iso-42001, ai-governance, policy-enforcement, uapk-gateway]
date: 2026-04-15
description: "The NIST AI Risk Management Framework's four functions map directly to how UAPK structures AI agent governance. Here's a practical guide to implementing the RMF with agent manifests."
---

NIST published the AI Risk Management Framework in January 2023. It's now referenced by the EU AI Act's technical standards bodies, DoD AI ethics guidelines, the Singapore MAS framework, and dozens of sector-specific AI governance documents. It's become the shared vocabulary for AI risk management — and it's voluntary, which means the organizations that implement it well get a structural advantage when regulators start asking questions.

The framework has four core functions: Govern, Map, Measure, Manage. Each maps directly to how UAPK structures AI agent governance.

<!-- truncate -->

## Govern: Policies, Culture, and Accountability

The Govern function establishes organizational policies, processes, and culture for AI risk management. It's the "who is responsible for what" layer.

For AI agents, Govern means:

- **Who is authorized to deploy an AI agent?** — Who can create and sign manifests?
- **Who is responsible for an agent's actions?** — The manifest's `metadata.contact` field
- **What review process exists before deployment?** — Manifest approval workflow
- **What escalation path exists for AI incidents?** — Human approval roles in governance config

The UAPK manifest builder's governance phase surfaces these questions explicitly. The approval workflow configuration — who can approve what action types, what escalation path, what happens at each threshold — is the Govern function operationalized.

## Map: Identifying and Contextualizing Risk

The Map function identifies the context, stakeholders, and risks associated with an AI system. It's the "what could go wrong and for whom" layer.

For AI agents, Map means:

- **What is this agent actually doing?** — Capabilities declaration
- **What data does it process?** — Data governance configuration
- **Who is affected by its decisions?** — Counterparty context
- **Which regulatory frameworks apply?** — The qualification funnel

The qualification funnel is the Map function's primary mechanism in UAPK. The four questions — geography, sector, activities, org traits — are exactly the contextual dimensions that determine what risks exist and which frameworks apply. The output is a framework list that maps risks to specific compliance obligations.

The `risk_indicators` field in the gateway's policy trace captures runtime risk signals: unusual action patterns, budget proximity, jurisdiction edge cases. That's Map operating continuously, not just at deployment time.

## Measure: Quantifying and Tracking Risk

The Measure function quantifies AI risks and tracks whether controls are working. It's the "how much risk and is it changing" layer.

For AI agents, Measure means:

- **How many actions is this agent taking?** — Action counters
- **How often is it being denied?** — Deny rate from interaction records
- **How often does it escalate vs. proceed?** — Escalation rate
- **Is it staying within budget?** — Budget utilization metrics
- **Is the audit chain intact?** — Chain integrity verification

Every interaction record is a Measure data point. The deny rate tells you whether the agent is regularly pushing against policy boundaries. A rising escalation rate might indicate the approval thresholds are miscalibrated. Budget utilization trends can predict when a daily limit will be hit.

These metrics are queryable from the interaction records API. Building a dashboard over them is the operationalization of the Measure function.

## Manage: Responding to Risk

The Manage function responds to identified risks — adjusting controls, escalating incidents, and improving the system over time. It's the "what do we do about it" layer.

For AI agents, Manage means:

- **Adjusting thresholds** when the escalation rate is too high or too low
- **Updating the denylist** when new sanctioned entities are identified
- **Revoking capability tokens** when an agent shows unexpected behavior
- **Updating the manifest** when the regulatory framework changes
- **Running the override token lifecycle** for HITL decisions

The manifest version history is the Manage function's change log. Every manifest update is a management action — a response to a risk signal, a regulatory change, or an operational finding.

## ISO 42001: The Certifiable Version

ISO 42001, published in 2023, is a certifiable AI Management System standard that aligns closely with NIST AI RMF's structure. Where NIST AI RMF is a framework (prescriptive but not certifiable), ISO 42001 follows the ISO management system structure (Plan-Do-Check-Act) and can be third-party certified.

For organizations that need a certification (not just a framework), ISO 42001 is the path. The good news: implementing NIST AI RMF first creates most of the documentation and evidence that ISO 42001 certification requires.

UAPK recommends both frameworks together. The manifest builder surfaces them as complementary, not competing.

## The Singapore Agentic AI Framework

MAS and IMDA published the Model AI Governance Framework for Agentic AI in January 2026. It builds on NIST AI RMF concepts but adds Singapore-specific guidance for autonomous, multi-step AI systems.

Key additions for agentic AI:
- **Principal Hierarchy**: who can instruct the agent, in what priority order
- **Task Boundary**: what the agent is authorized to do (maps to capabilities + tool allowlist)
- **Minimal Footprint**: the agent should request only the permissions it needs (maps to minimum necessary principle)
- **Explainability**: the agent's decisions should be reconstructible

All four concepts have direct manifest implementations in UAPK. The Singapore framework is the most forward-looking regulatory document for autonomous AI agents currently in force — and its requirements are a useful checklist for any AI agent deployment, regardless of jurisdiction.

## A Practical Starting Point

For organizations implementing NIST AI RMF for the first time:

1. Start with the qualification funnel — Map function
2. Build the manifest — Govern function
3. Deploy with gateway enforcement — Manage function
4. Review interaction records weekly — Measure function
5. Update the manifest when you find gaps — iterative Manage

The framework is iterative by design. The first manifest doesn't need to be perfect — it needs to be deployed, monitored, and improved.
