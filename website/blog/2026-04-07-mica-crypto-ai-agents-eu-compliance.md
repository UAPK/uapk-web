---
slug: mica-crypto-ai-agents-eu-compliance
title: "MiCA and AI Agents: What Europe's Crypto Regulation Requires at the Agent Layer"
authors: [davidsanker]
tags: [mica, crypto, aml, gdpr, ai-governance, financial-services, uapk-gateway]
date: 2026-04-07
description: "The Markets in Crypto-Assets Regulation is fully in force for CASPs. Here's what MiCA requires from AI agents handling token transfers, wallet creation, and crypto advisory functions."
---

MiCA — the EU's Markets in Crypto-Assets Regulation — became fully applicable to Crypto-Asset Service Providers (CASPs) on December 30, 2024. If you operate a crypto exchange, custody service, or trading platform in the EU, you are now subject to MiCA's full requirements.

AI agents that automate crypto transfers, execute trades, manage wallets, or provide investment advice on crypto assets are in scope. MiCA doesn't have an exemption for "it's just an algorithm."

<!-- truncate -->

## MiCA's Core Requirements for CASPs

**Authorisation**
CASPs must be authorised by a national competent authority (NCA) before providing services. This is an organizational requirement, not an AI-layer requirement — but authorisation-related documentation must describe the automated systems used, including their controls.

**The Travel Rule (Article 82)**
MiCA incorporates the FATF Travel Rule for crypto. Transfers above €1,000 must include originator and beneficiary information throughout the transfer chain. An AI agent initiating crypto transfers must:
- Enforce the €1,000 threshold for Travel Rule triggering
- Ensure beneficiary and originator data is collected before transfers
- Screen against sanctions lists before any transfer completes

**Conflicts of Interest (Article 79)**
CASPs must identify and manage conflicts of interest. For AI-driven trading or portfolio management, this means documenting how the AI's decision logic handles situations where the platform's interests might differ from the client's.

**Best Execution (Article 78)**
When executing client orders, CASPs must take all sufficient steps to obtain the best possible result for clients. For AI-executed trades, the execution logic must be documented and auditable.

**Record-Keeping (Article 75)**
CASPs must keep records of all services and transactions for at least 5 years. For AI agents, this means every automated decision — every transfer initiated, every trade executed, every wallet created — must be in that record.

## The Mixer Problem

FATF Recommendation 15 and MiCA both treat transactions with mixers, tumblers, and anonymizing services as high-risk activities that require enhanced due diligence. An AI agent should never complete a transfer to a known mixer address.

This is a counterparty denylist requirement, not just a policy recommendation:

```json
{
  "policy": {
    "counterparty_denylist": [
      "tornado-cash.example",
      "chipmixer.example",
      "blender.io.example"
    ],
    "amount_caps": {
      "EUR": 10000
    }
  },
  "constraints": {
    "require_human_approval": ["crypto:transfer", "wallet:create"],
    "audit_retention_days": 1825
  }
}
```

The `counterparty_denylist` is enforced before any crypto transfer completes. The `amount_caps.EUR: 10000` is a hard limit — not just for MiCA's Travel Rule threshold but because MiCA also requires enhanced due diligence for large transactions.

`require_human_approval` on `crypto:transfer` means no transfer executes without a human approver. Given the irreversibility of blockchain transactions, this is not just a compliance requirement — it's basic operational sanity.

## The AML/MiCA Stack

MiCA doesn't replace AML/BSA obligations — it stacks on top of them. EU crypto operators face:

- **5AMLD/6AMLD** (AML framework)
- **MiCA** (crypto-specific market regulation)
- **GDPR** (for personal data of EU customers)
- **DORA** (operational resilience, for larger platforms)

When the UAPK qualification funnel sees EU geography + crypto sector, it recommends all four. Each framework surfaces different questions in the manifest builder. The policy fields they produce overlap but don't conflict — `require_human_approval`, `counterparty_denylist`, `amount_caps`, and `audit_retention_days` satisfy requirements across all four simultaneously.

## Real-Time Sanctions Screening

The requirement to screen against sanctions lists in real time creates an operational challenge: OFAC, EU consolidated list, and FATF lists are updated continuously. A static denylist goes stale.

For production deployments, the counterparty screening should be a live API call — not a hardcoded list. UAPK's tool connector architecture allows wiring a sanctions screening service as a pre-execution check. The manifest declares the screening tool as required, and the gateway ensures it's called before any transfer proceeds.

If the screening service is unavailable, the gateway denies the transfer. A connectivity issue is not a reason to bypass sanctions compliance.

## Penalties Under MiCA

NCA enforcement powers under MiCA include:

- Fines up to 12.5% of annual turnover (for legal entities)
- Fines up to €700,000 for natural persons
- Temporary or permanent ban from providing CASP services
- Public disclosure of the sanction

For AI-specific failures — agents executing transfers without the required Travel Rule data, bypassing sanctions screening — the argument that "the algorithm did it" doesn't reduce liability. MiCA holds CASPs responsible for their automated systems.
