---
slug: nist-csf-2-ai-agents-cybersecurity-framework
title: "NIST CSF 2.0 and AI Agents: Govern, Identify, Protect, Detect, Respond, Recover"
authors: [davidsanker]
tags: [nist-csf, nist-ai-rmf, ai-governance, audit-logging, policy-enforcement, uapk-gateway]
date: 2026-05-04
description: "NIST CSF 2.0 added a new Govern function and AI-specific implementation examples. For US federal contractors, critical infrastructure operators, and companies that use NIST as their security baseline, here's how CSF 2.0 applies to AI agents."
---

NIST released Cybersecurity Framework 2.0 in February 2024. The major change from CSF 1.1: a new **Govern** function was added, making it a six-function framework (GV, ID, PR, DE, RS, RC). The Govern function addresses organizational context, risk management strategy, and cybersecurity supply chain — topics that were scattered across CSF 1.1 but are now first-class functions.

For AI agents, the new Govern function is the most directly relevant addition. It's where organizational accountability for AI systems lives.

NIST CSF is voluntary for most US organizations, but it functions as a de facto standard for:
- Federal contractors and agencies (often required by contract or policy)
- Critical infrastructure operators (energy, water, finance, healthcare)
- Organizations seeking cyber insurance
- Any company using NIST as a security baseline alongside FedRAMP or CMMC

<!-- truncate -->

## The Six Functions

| Function | Code | What It Covers |
|----------|------|----------------|
| Govern | GV | Risk management strategy, roles and responsibilities, supply chain security, policies |
| Identify | ID | Asset management, risk assessment, improvement |
| Protect | PR | Access control, awareness, data security, platform security, resilience |
| Detect | DE | Continuous monitoring, adverse event analysis |
| Respond | RS | Incident response, analysis, containment, communication |
| Recover | RC | Recovery planning, communication |

The functions operate as a cycle: Govern sets the context and strategy, Identify finds the risks, Protect implements controls, Detect finds failures, Respond addresses them, Recover restores normal operations.

## GV.OC: Organizational Context

**GV.OC-05**: Outcomes, capabilities, and services that the organization depends on are understood and communicated.

For AI agents: the manifest's tool allowlist documents the capabilities the agent depends on. If the analytics platform is down, which agent workflows are affected? The tool declarations are the dependency map.

**GV.OC-06**: Cybersecurity risk is considered in third-party dependencies.

For AI agents: AI model providers and API dependencies are third-party cybersecurity risks. The qualification funnel's vendor management assessment and the tool allowlist's scope both trace back to GV.OC-06.

## GV.RM: Risk Management Strategy

**GV.RM-02**: Risk appetite is established, communicated, and applied.

The `require_human_approval` threshold and `approval_thresholds.amount` values are the operational expression of risk appetite. A $25,000 approval threshold says: "we accept autonomous AI decisions below $25k; above that, the risk tolerance requires human review." That number should be derived from a documented risk appetite statement.

**GV.RM-06**: Risk management strategy considers supply chain risks.

AI model providers are supply chain. When you deploy an AI agent, the model's behavior is a supply chain dependency — the model provider's security posture, their model update policies, and their incident response capabilities are all GV.RM-06 concerns.

## GV.SC: Cybersecurity Supply Chain Risk Management

**GV.SC-04**: Suppliers are known and prioritized by criticality.

For AI agents: the tool allowlist is the supplier list. The policy engine's tool allowlist check ensures the agent only uses pre-approved suppliers. New tools require manifest updates — which creates a supplier approval process with audit trail.

**GV.SC-07**: Suppliers are assessed, as applicable, to determine cybersecurity requirements.

When you add a tool to the allowlist, that tool's security posture should be assessed. The manifest changelog entry for "added analytics_platform v2.0 to tool allowlist" should reference the vendor security assessment that justified the addition.

## ID.AM: Asset Management

**ID.AM-08**: Systems, hardware, software, services, and data are managed throughout their life cycles.

AI agents are assets with lifecycles. The manifest version history is the lifecycle record: when the agent was deployed, what capabilities it had at each version, when it was decommissioned. The `agent.version` field in the manifest tracks this.

## PR.AA: Identity Management, Authentication, and Access Control

**PR.AA-01**: Identities and credentials are issued, managed, revoked, and audited.

Capability tokens are the credentials for AI agents. They have expiry, can be revoked, are scoped to specific actions, and create an audit record when used. The `require_capability_token: true` policy control implements PR.AA-01 for AI agents.

**PR.AA-05**: Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed.

The manifest's `policy` section is the access entitlement definition. The gateway enforces it. The version history documents review. The approval workflow records document enforcement decisions. This is a direct PR.AA-05 implementation.

## DE.CM: Continuous Monitoring

**DE.CM-01**: Networks and network services are monitored to find potentially adverse events.

**DE.CM-06**: External service provider activities and services are monitored to find potentially adverse events.

For AI agents: the gateway's rate limiting counters, the daily budget tracking, and the anomaly detection over interaction records implement DE.CM-01 and DE.CM-06. Unusual patterns — sudden volume spikes, repeated denies, requests to new tools — are the adverse events to detect.

The audit log is the monitoring data source. Without it, there's nothing to monitor.

## RS.MA: Incident Management

**RS.MA-01**: The incident response plan is executed in coordination with relevant third parties, as appropriate.

For AI agent incidents: the approval workflow's escalation path is the incident response plan. When an action is denied or escalated, the workflow defines who responds, what they decide, and how the decision is recorded. `require_human_approval` makes escalation automatic for defined high-risk action types.

## NIST CSF 2.0 vs. NIST AI RMF

The two frameworks address different but complementary concerns:

- **NIST CSF 2.0**: Cybersecurity risk management (security of AI systems — is someone attacking them, are they resilient)
- **NIST AI RMF**: AI risk management (trustworthiness of AI systems — are they fair, explainable, accountable)

An organization should implement both. CSF 2.0 covers the infrastructure and cybersecurity controls; AI RMF covers the governance and trustworthiness controls. The UAPK manifest implements both: policy enforcement and tool restrictions are CSF controls; human approval workflows and audit trails are AI RMF controls.

## CSF 2.0 Implementation Tiers for AI

CSF 2.0 defines four implementation tiers (Partial → Risk-Informed → Repeatable → Adaptive):

| Tier | AI Governance Indicator |
|------|------------------------|
| 1 – Partial | Ad hoc AI deployment, no manifest, no audit log |
| 2 – Risk-Informed | Manifests exist, reviewed annually, basic logging |
| 3 – Repeatable | Policy is formally established, version-controlled, reviewed on schedule |
| 4 – Adaptive | Real-time monitoring, automatic policy updates in response to threat intelligence |

Most enterprises deploying UAPK start at Tier 2 and target Tier 3. The weekly framework monitoring script (checking for regulatory updates) and quarterly manifest reviews are the Tier 3 → Tier 4 progression path.

## NIST CSF for US Critical Infrastructure AI

For energy, water, finance, and healthcare operators, NIST CSF 2.0 is effectively mandatory — either through explicit regulatory reference or through sector-specific frameworks that incorporate it (NERC CIP for energy, HIPAA Security Rule for healthcare).

The UAPK qualification engine routes these organizations to both `nist_csf` and their sector-specific frameworks. An energy company gets: nist_csf + nerc_cip + iso_27001 at minimum. The CSF 2.0 controls are implemented by UAPK; the sector-specific controls add additional constraints on top.

```json
{
  "constraints": {
    "require_human_approval": [
      "grid:configure",
      "system:patch",
      "access:provision"
    ],
    "audit_retention_days": 2555,
    "allowed_hours": {"start": "06:00", "end": "22:00", "timezone": "US/Eastern"}
  },
  "policy": {
    "jurisdiction_allowlist": ["US"],
    "tool_allowlist": [
      "scada_read_only",
      "grid_monitoring",
      "maintenance_scheduler"
    ],
    "require_capability_token": true
  }
}
```

`allowed_hours` prevents autonomous AI operations during overnight hours when human oversight is minimal — a practical implementation of GV.RM-02 (risk appetite applied operationally).
