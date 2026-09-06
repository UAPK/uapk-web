---
slug: gdpr-ai-agents-article-22-automated-decisions
title: "GDPR and AI Agents: What Article 22 Actually Requires"
authors: [davidsanker]
tags: [gdpr, ai-governance, data-privacy, eu-ai-act, policy-enforcement, uapk-gateway]
date: 2026-04-02
description: "GDPR Article 22 gives EU residents the right not to be subject to purely automated decisions. Here's exactly what that means for your AI agent — and what controls you need."
---

GDPR Article 22 is the one provision most AI teams misread. It says EU data subjects have the right not to be subject to "a decision based solely on automated processing" that produces legal or similarly significant effects on them.

The common misreading: "our AI only makes recommendations, so Article 22 doesn't apply."

The problem: regulators and courts have steadily expanded what counts as a "significant effect." A loan denial, an insurance quote, a job screening shortlist, a fraud flag that freezes an account — all of these have been held to trigger Article 22 rights. If your AI agent's output feeds directly into a decision that affects a person's access to money, services, or employment, you are likely in scope.

<!-- truncate -->

## What Article 22 Requires

Three things:

**1. A human must be able to intervene.**
You need a mechanism for a data subject to request human review of any automated decision. This isn't optional at the policy level — it's a data subject right.

**2. The data subject must be able to contest the decision.**
They need a meaningful way to challenge the outcome, not just a form that goes nowhere.

**3. You must be able to explain the decision.**
The "right to explanation" under Recitals 71 and 75 means you need to know *why* the automated system made its determination — not just what the output was.

## What This Means for an AI Agent

If your AI agent makes or strongly influences decisions affecting EU residents, you need:

- **A human approval gate** for any action that could trigger Article 22 scrutiny
- **An audit log** that records exactly what the agent evaluated, what data it used, and what decision it reached
- **An override mechanism** that lets a human reviewer reverse or modify the automated outcome

This isn't just about having these capabilities — it's about having them in a form that you can demonstrate to a DPA (Data Protection Authority) on request.

## The UAPK Mapping

In a UAPK manifest, Article 22 compliance maps to three specific fields:

```json
{
  "constraints": {
    "require_human_approval": ["decision:credit", "decision:fraud_flag", "decision:screening"]
  },
  "policy": {
    "require_capability_token": true
  }
}
```

The `require_human_approval` list enforces the intervention requirement at the gateway level — the agent *cannot* execute these action types without a human approver signing off via a one-time override token. The audit log captures the full decision chain: what request came in, what policy was evaluated, what the outcome was, who approved it.

That audit chain is what you hand to the DPA. It's hash-chained and cryptographically signed, so you can prove it hasn't been modified after the fact.

## What the EU AI Act Adds

The EU AI Act (fully applicable for high-risk systems from August 2026) layers on top of GDPR Article 22. For AI systems in Annex III categories — credit scoring, employment screening, biometric categorization, public services — you additionally need:

- A conformity assessment before deployment
- Technical documentation of the AI system
- Post-market monitoring
- Human oversight measures embedded in the system design

The UAPK manifest builder surfaces EU AI Act requirements as a separate framework from GDPR. If your qualification answers include EU geography and automated decisions, both frameworks are recommended — and the questions are distinct.

## Common Misconceptions

**"We have a human in the loop, so we're compliant."**
Only if that human can actually influence the outcome. A rubber-stamp approval that processes 500 decisions per hour without reading any of them does not satisfy Article 22.

**"Our model is explainable, so we're covered."**
Explainability is necessary but not sufficient. You also need the human review mechanism and the contestation process.

**"Article 22 only applies to fully automated decisions."**
Correct on the text, but regulators have consistently interpreted "solely automated" to include decisions where humans play only a nominal role. If the human can't realistically override the AI, it's effectively sole automation.

## Practical Checklist

For any AI agent making decisions about EU residents:

- [ ] `require_human_approval` set for all Article 22-relevant action types
- [ ] Audit log captures: input data, model version, decision output, human reviewer identity, override token ID
- [ ] Data subjects can request human review via a documented process
- [ ] Audit retention ≥ the applicable statute of limitations (GDPR enforcement actions have been brought years after the fact)
- [ ] DPA-ready evidence bundle: `POST /api/v1/audit-export/evidence-bundle`

The last point matters: if a DPA comes knocking, you have 72 hours to produce a breach notification and ongoing obligations for evidence. Having an exportable, locked evidence bundle ready before you need it is the difference between a manageable investigation and a crisis.
