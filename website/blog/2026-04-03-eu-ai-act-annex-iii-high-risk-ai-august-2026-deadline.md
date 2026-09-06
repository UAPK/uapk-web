---
slug: eu-ai-act-annex-iii-high-risk-ai-august-2026-deadline
title: "EU AI Act Annex III: The August 2026 Deadline Is Not a Drill"
authors: [davidsanker]
tags: [eu-ai-act, ai-governance, regulatory-compliance, policy-enforcement, uapk-gateway]
date: 2026-04-03
description: "High-risk AI systems under Annex III of the EU AI Act must be compliant by August 2026. Here's what's in scope, what's required, and how to prepare now."
---

August 2, 2026. That's when Article 6 obligations for high-risk AI systems under Annex III of the EU AI Act become enforceable. If you're deploying AI agents in any of the eight Annex III categories, you have months — not years — to get compliant.

The categories are broader than most teams expect.

<!-- truncate -->

## What's in Annex III

The eight categories of high-risk AI:

1. **Biometric identification and categorization** — real-time remote biometric ID in public spaces, emotion recognition systems
2. **Critical infrastructure** — AI managing roads, water, gas, electricity, internet
3. **Education** — AI determining access to educational institutions, evaluating students
4. **Employment** — CV screening, automated hiring/firing decisions, performance monitoring
5. **Essential services** — credit scoring, insurance risk assessment, emergency service dispatch
6. **Law enforcement** — predicting criminal recidivism, deepfake detection, evidence evaluation
7. **Migration and border control** — asylum assessment, visa applications, border security
8. **Administration of justice** — AI assisting courts, dispute resolution, legal decision support

If your AI agent operates in any of these areas and is deployed in the EU (or affects EU residents), you are in scope.

## What's Required

For high-risk AI systems, the Act requires:

**Risk management system** — documented, ongoing process for identifying and mitigating risks. Not a one-time assessment; it must be updated throughout the system's lifecycle.

**Data governance** — documented practices for training data, including bias testing. Must be able to demonstrate data quality measures.

**Technical documentation** — detailed description of the system: purpose, components, logic, training approach, performance metrics.

**Record-keeping** — the system must automatically log events "to the extent necessary to enable the identification of situations that may result in the AI system presenting a risk." This is the audit log requirement.

**Transparency** — users interacting with the AI must know they're interacting with an AI. In automated decision contexts, affected persons must be informed.

**Human oversight** — humans must be able to override, interrupt, or stop the AI system. The oversight measures must be built into the system design — not just available in principle.

**Accuracy, robustness, and cybersecurity** — the system must achieve appropriate levels of accuracy, be resilient to adversarial inputs, and maintain security.

**Conformity assessment** — before placing the system on the market, providers must conduct a conformity assessment and affix the CE marking.

## The UAPK Coverage

The UAPK manifest's EU AI Act framework surfaces questions specifically about Annex III compliance:

- Is this system high-risk under Annex III?
- Which category?
- Are human oversight measures embedded in the system (not just available)?
- Is the audit log capturing sufficient detail for incident reconstruction?
- Is the technical documentation current?

The `require_human_approval` list in the manifest's constraints section directly implements the human oversight requirement. Every Annex III action type should be in that list — the agent cannot act without a human approver creating a one-time override token.

The UAPK audit log satisfies the record-keeping requirement. Each interaction record captures: the agent's identity, the action requested, the policy evaluated, the decision reached, the data used to make that decision, and a timestamp. The hash chain ensures the logs can't be retroactively altered — which is exactly what "automatic logging to enable risk identification" requires.

## The Timeline

- **February 2025**: GPAI model provider obligations apply
- **August 2026**: High-risk AI (Annex III) obligations apply — **this is the critical deadline**
- **August 2027**: Full enforcement for all remaining provisions

The August 2026 deadline is nine months away as of this writing. The conformity assessment alone — which requires gathering technical documentation, running bias evaluations, and completing the assessment process — typically takes 3–6 months for a non-trivial system.

That means the window to start preparing is now.

## Penalties

Non-compliance with high-risk AI obligations carries penalties up to €30 million or 6% of global annual turnover, whichever is higher. For prohibited AI practices, it's 7% or €35 million. These are EU AI Act fines — stacked on top of any GDPR enforcement actions.

## What to Do Now

1. **Audit your AI agents** — does any of them fall into an Annex III category?
2. **Document your risk management process** — not just "we have one" but the specific procedures
3. **Check your audit log** — does it capture enough to reconstruct incidents? Is it tamper-evident?
4. **Verify human oversight is structural, not procedural** — a policy saying "humans should review" doesn't satisfy the Act; a technical gate that requires approval before action does
5. **Start the conformity assessment** — even if you use a notified body, the documentation gathering is your work

The UAPK manifest builder's EU AI Act framework surfaces all of these as explicit questions. The answers compile directly into the manifest's compliance posture, which becomes the evidence record for your conformity assessment.
