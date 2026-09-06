---
slug: lgpd-brazil-ai-agents-anpd-enforcement
title: "LGPD and AI Agents in Brazil: ANPD Enforcement Is Active and Growing"
authors: [davidsanker]
tags: [lgpd, data-privacy, ai-governance, financial-services, uapk-gateway]
date: 2026-04-13
description: "Brazil's LGPD has moved from grace period to active enforcement. Here's what the Lei Geral de Proteção de Dados requires from AI agents processing Brazilian personal data."
---

Brazil's LGPD (Lei Geral de Proteção de Dados) came into force in September 2020. After a grace period, ANPD (Autoridade Nacional de Proteção de Dados) began issuing enforcement actions in 2023. The fines are real, the investigations are real, and the pattern of enforcement is becoming clear.

If your AI agents process personal data of Brazilian residents — including purchasing behavior, CPF numbers, location data, or any other information that identifies an individual — LGPD applies regardless of where your company is headquartered.

<!-- truncate -->

## LGPD's Structure (For GDPR Practitioners)

LGPD is Brazil's GDPR equivalent, and if you know GDPR, the concepts map closely:

| GDPR | LGPD |
|------|------|
| Controller | Controlador |
| Processor | Operador |
| Data Subject Rights | Direitos do Titular |
| DPA (CNIL, ICO, etc.) | ANPD |
| Article 6 Legal Bases | Article 7 Legal Bases |
| Article 22 (Automated Decisions) | Article 20 |
| Right to Erasure | Article 18(IV) |
| Breach Notification | Article 48 |

The main structural difference: LGPD's 10 legal bases for processing are slightly broader than GDPR's 6, and Brazilian legitimate interests considerations often play out differently in practice.

## Article 20: Automated Decisions About Brazilians

LGPD Article 20 gives data subjects the right to request review of decisions made solely by automated means that affect their interests — including profiling, scoring, and recommendations.

For AI agents making automated decisions about Brazilian users (fraud scoring, credit decisions, personalized pricing, content recommendations), Article 20 requires:

- The ability to request human review
- An explanation of the decision criteria and procedures
- Information about the data categories used

This maps directly to `require_human_approval` for decision-relevant action types, plus an audit log that captures the decision criteria — not just the outcome.

## The Brazilian E-commerce Context

Brazil's digital economy is significant: Pix (the central bank's instant payment system) processed over R$17 trillion in 2024. Brazilian e-commerce is among the largest in Latin America.

For e-commerce AI agents, the LGPD intersection points are:

**CPF numbers** — Brazil's individual taxpayer identification number. It's sensitive personal data and frequent in e-commerce transactions (required for invoicing). Any agent that accesses, stores, or transmits CPFs needs explicit legal basis documentation.

**Purchase history and behavioral profiling** — Used for recommendations and targeted offers. If the profiling produces automated decisions about pricing or availability, Article 20 is triggered.

**Payment data** — Pix transactions include CPF and bank account information. PCI-DSS also applies for card transactions.

The UAPK manifest for a Brazilian e-commerce agent:

```json
{
  "constraints": {
    "require_human_approval": ["data:read"],
    "audit_retention_days": 1825
  },
  "policy": {
    "jurisdiction_allowlist": ["BR", "US"],
    "amount_caps": {
      "BRL": 5000,
      "USD": 1000
    },
    "tool_allowlist": [
      "mercadopago",
      "pix_processor",
      "customer_pii_store",
      "email_marketing"
    ]
  }
}
```

`require_human_approval` on `data:read` means any access to the PII store (which contains CPFs) requires approval. `jurisdiction_allowlist: ["BR", "US"]` limits where data can flow. The `amount_caps` apply both LGPD context (limiting automated payment exposure) and PCI-DSS context.

## ANPD Enforcement Priorities

ANPD's enforcement actions have focused on:

1. **Lack of legal basis** for processing — using personal data without documenting why
2. **Inadequate security measures** — particularly for data breaches
3. **Failure to respond to data subject rights requests** — the right to access, correction, deletion, and portability
4. **Inadequate DPO (Data Protection Officer) designation** — required for certain processing activities

For AI agents, items 1 and 2 are most directly relevant. The manifest's framework evidence section forces documentation of legal basis at the time of deployment, not after a regulator asks.

## Breach Notification Under LGPD

Article 48 requires notification to ANPD and affected data subjects of a "relevant security incident" within a "reasonable period" (ANPD has specified this as 2 business days for ANPD notification, 5 business days for data subject notification in certain cases).

The breach notification timeline — 2 business days — is extremely short. For an AI agent breach scenario, you need to be able to answer within hours: what data was involved, how many individuals, what the agent did with it.

The UAPK audit log answers these questions. The evidence bundle, scoped to the breach time window, is the starting point for your ANPD notification.

## ISO 27701 as LGPD Evidence

ISO 27701 (Privacy Information Management System, an extension of ISO 27001) is increasingly used as evidence of LGPD compliance by Brazilian organizations. ANPD has referenced ISO-aligned controls in its enforcement guidance.

UAPK's qualification funnel recommends ISO 27701 alongside LGPD when Brazil geography is selected. The two frameworks are designed to be used together: ISO 27701 provides the process framework; LGPD defines the specific rights and obligations. The manifest's policy fields satisfy both.
