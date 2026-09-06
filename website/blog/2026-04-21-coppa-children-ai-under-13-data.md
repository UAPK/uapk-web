---
slug: coppa-children-ai-under-13-data-verifiable-consent
title: "COPPA and AI: Why Children's Data Is the Highest-Risk Category in US AI Deployments"
authors: [davidsanker]
tags: [coppa, ccpa, data-privacy, ai-governance, policy-enforcement, uapk-gateway]
date: 2026-04-21
description: "COPPA's strict requirements for AI systems that could interact with or collect data from children under 13 carry some of the highest penalty rates in US privacy law. Here's what to build in."
---

The Children's Online Privacy Protection Act has been consistently enforced by the FTC for 25 years. COPPA violations regularly result in the largest per-violation penalties in US privacy law: up to $51,744 per violation as of 2023. For AI systems that collect data from or target content to children under 13, there is no equivalent risk-adjusted situation anywhere else in US privacy regulation.

The FTC has made clear that the "general audience" defense — "we didn't know children were using our platform" — requires demonstrating concrete age-verification measures, not just a terms-of-service statement.

<!-- truncate -->

## What Triggers COPPA

COPPA applies when you have "actual knowledge" that you're collecting personal information from children under 13, OR when you operate a child-directed website or online service.

"Child-directed" is determined by multiple factors: subject matter, visual content, use of animated characters, music or other audio, celebrities or activities appealing to children, age of models, and whether advertising is targeted to children. The FTC looks at the totality — a platform doesn't need to be exclusively for children to be child-directed.

For AI agents, the relevant triggers are:
- An AI agent collecting personal information from users on a platform where children are the primary audience
- An AI agent operating on a general-audience platform that has actual knowledge of child users
- An AI recommendation engine serving content or ads targeted to children

## What COPPA Requires

**Verifiable parental consent** before collecting, using, or disclosing personal information from children under 13. The consent mechanism must be one of several FTC-approved methods (credit card verification, signed consent form, video call, etc.). A checkbox is not sufficient.

**Privacy notice to parents** explaining what information is collected, how it's used, and disclosure practices.

**Right to review and delete** — parents can review the child's personal information and request deletion.

**Data minimization** — collect only what's necessary for the activity the child participates in.

**Prohibition on conditioning participation** on more data than necessary.

**Data security** — "reasonable procedures" to protect the confidentiality, security, and integrity of children's personal information.

## The AI-Specific Risks

**Behavioral profiling**: AI recommendation engines that profile children based on viewing history, engagement patterns, or search queries are collecting personal information subject to COPPA.

**Voice and biometric data**: AI voice assistants and systems using facial recognition to interact with children trigger COPPA's "audio files that contain a child's voice" and biometric identifiers categories.

**Persistent identifiers**: Many AI systems use cookies, device IDs, or user tokens to maintain session context. For children, these persistent identifiers are personal information under COPPA even if no name or email is collected.

**Content personalization**: AI that personalizes content or recommendations for individual children is using personal information in a way that requires prior parental consent.

## The Manifest Configuration

For an AI agent that could interact with users under 13:

```json
{
  "constraints": {
    "require_human_approval": [
      "data:write",
      "recommendation:serve",
      "content:generate"
    ],
    "audit_retention_days": 365
  },
  "policy": {
    "jurisdiction_allowlist": ["US"],
    "tool_allowlist": [
      "age_verified_content_db",
      "coppa_compliant_recommendation",
      "parent_consent_store"
    ],
    "require_capability_token": true
  }
}
```

`tool_allowlist` limited to COPPA-compliant data stores and recommendation engines ensures the agent can only access age-appropriate, consent-gated data sources.

`require_human_approval` on `data:write` and `recommendation:serve` means no child's profile data is modified and no personalized recommendations are served without a review gate. Given COPPA's consent requirements, this is the minimum viable human oversight.

## FTC Enforcement Pattern

The FTC's COPPA enforcement actions have targeted:
- **YouTube/Google** ($170 million, 2019) — knowingly serving targeted ads to children
- **Epic Games/Fortnite** ($275 million, 2023) — default-on matchmaking with adults, data collection without consent
- **Musical.ly/TikTok** ($5.7 million, 2019) — collecting information from children under 13 without parental consent

The pattern: the FTC goes hard on companies that knew or should have known children were on their platforms and didn't implement the required controls. AI recommendation systems that have demonstrably served children content without parental consent are exactly the kind of case the FTC pursues.

## The UK COPPA Equivalent: Age Appropriate Design Code

The UK's Children's Code (Age Appropriate Design Code) extends beyond COPPA's data collection focus to require that online services likely to be accessed by children apply 15 standards by default, including privacy settings set to high by default, no behavioral advertising to children, and no use of nudge techniques to encourage children to share more data.

For AI agents deployed in the UK that could reach children: the UK AI framework + ICO's Children's Code apply together. UAPK's qualification funnel recommends UK AI regulation for UK deployments. The manifest builder questions for UK AI governance include the Children's Code requirements where the `children_content` activity is selected.
