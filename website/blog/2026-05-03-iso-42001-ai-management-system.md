---
slug: iso-42001-ai-management-system
title: "ISO 42001: The AI Management System Standard"
authors: [davidsanker]
tags: [iso-42001, iso-27001, ai-governance, policy-enforcement, qualification-funnel, uapk-gateway]
date: 2026-05-03
description: "ISO/IEC 42001:2023 is the first international standard for AI management systems. It's what the EU AI Act and Singapore's AI Verify framework point to for demonstrating conformance — and it's structured to integrate with ISO 27001."
---

ISO/IEC 42001:2023 — published December 2023 — is the first international standard for Artificial Intelligence Management Systems (AIMS). It provides a framework for establishing, implementing, maintaining, and continuously improving AI governance within organizations. Think of it as ISO 27001, but with AI as the subject rather than information security.

For organizations subject to the EU AI Act, Singapore's AI Verify framework, or any regulator that accepts ISO standards as evidence of conformance, ISO 42001 is becoming the certification path of choice. The standard was built to align with other ISO management system standards (ISO 27001, ISO 9001) — if your organization already has one, the implementation effort for ISO 42001 is substantially lower.

<!-- truncate -->

## The Structure

ISO 42001 follows the ISO Annex SL high-level structure (the same template used by ISO 27001, ISO 9001, ISO 14001). Clauses 4–10 are management system requirements:

| Clause | Topic |
|--------|-------|
| 4 | Context of the organization |
| 5 | Leadership |
| 6 | Planning |
| 7 | Support |
| 8 | Operation |
| 9 | Performance evaluation |
| 10 | Improvement |

The controls are in Annex A (organizational controls) and Annex B (controls for AI-specific requirements). Unlike ISO 27001's 93-control Annex A, ISO 42001's annexes are leaner and more focused on AI-specific concerns: impact assessment, data management, system lifecycle, and third-party oversight.

## Key Requirements for AI Agents

**Clause 6.1: AI Risk Assessment**

The standard requires organizations to establish, implement, and maintain an AI risk assessment process. For each AI system, you must identify risks to individuals, groups, and society arising from the AI system's intended use and potential misuse.

For AI agents specifically: the risk assessment must address autonomous operation risks — what happens when the agent makes a wrong decision, what populations could be affected, and what the severity of harm would be. This is the formal risk documentation behind the `require_human_approval` choice.

**Annex A.6.1: Policies for responsible development and use of AI**

Organizations must have documented policies covering the intended use, governance structure, and accountability for AI systems. The UAPK manifest is the per-agent instantiation of this policy — but the standard requires an overarching organizational AI policy that the agent-level manifests implement.

**Annex A.6.2: Internal organization (AI roles)**

The standard requires named roles for AI governance: who is responsible for AI risk, who approves AI deployment, who monitors ongoing operations. This maps directly to the approval workflow: approver roles are named individuals with specific accountability.

**Annex A.8: AI System Impact Assessment**

Before deploying an AI system, organizations must conduct an impact assessment covering: the purpose and context of use, the stakeholders affected, potential harms, and the controls implemented to mitigate those harms. This assessment is updated when the AI system changes materially.

The impact assessment is the document that explains why the manifest is configured the way it is. `require_human_approval: ["recommendation:generate"]` should trace back to a risk assessment finding that unsupervised AI recommendations create a harm risk that justifies the human oversight cost.

**Annex B.5.4: AI system provenance**

Organizations must maintain records of AI system provenance — what training data, what model version, what configuration was used. For deployed AI agents: the manifest version + commit hash is the configuration provenance record.

## ISO 42001 and ISO 27001: Integration

ISO 42001 was designed to integrate with ISO 27001. The relationship:

- ISO 27001 covers information security (confidentiality, integrity, availability of data)
- ISO 42001 covers AI governance (responsibility, accountability, transparency, explainability of AI systems)

An AI agent that processes personal data or makes decisions affecting people needs both. ISO 27001 handles the security controls (authentication, encryption, access control). ISO 42001 handles the AI governance controls (oversight, explainability, impact assessment).

The shared infrastructure: management review, internal audit, corrective action, document control. Organizations with ISO 27001 already have this machinery running — adding ISO 42001 extends the scope rather than building a second system.

## ISO 42001 and the EU AI Act

The EU AI Act (Article 9) requires that high-risk AI systems have a quality management system covering the entire AI system lifecycle. The EU AI Act's technical documentation requirements (Annex IV) overlap substantially with ISO 42001's Annex A and B controls.

The European Commission is expected to recognize ISO 42001 as providing a presumption of conformity for certain EU AI Act requirements — similar to how ISO 27001 provides presumption of conformity for certain NIS2 requirements. The specific scope of presumption isn't finalized yet, but organizations certifying to ISO 42001 are building a defensible compliance record regardless.

## Certification vs. Self-Assessment

ISO 42001 supports both third-party certification (audited by an accredited certification body) and self-assessment (internal conformance declaration). The choice depends on what your stakeholders require:

- **Enterprise buyers**: increasingly requesting third-party ISO 42001 certificates alongside SOC 2 reports
- **EU AI Act compliance**: third-party certification strengthens your conformity assessment position
- **Internal governance**: self-assessment is sufficient for demonstrating management discipline

The certification audit examines: scope definition, risk assessment records, control implementation evidence, performance measurement, and management review minutes. The audit log and manifest history are primary evidence for the control implementation examination.

## The UAPK Manifest as ISO 42001 Evidence

```json
{
  "agent": {
    "id": "iso42001-compliant-agent",
    "name": "ISO 42001 Governed Agent",
    "version": "2.1.0"
  },
  "constraints": {
    "require_human_approval": ["decision:recommend", "content:publish"],
    "audit_retention_days": 1095
  },
  "policy": {
    "tool_allowlist": [
      "approved_knowledge_base",
      "crm_system",
      "notification_service"
    ],
    "require_capability_token": true
  },
  "metadata": {
    "iso42001_scope": "Customer recommendation agent",
    "impact_assessment_ref": "IA-2024-003",
    "risk_owner": "Head of AI Governance",
    "last_reviewed": "2026-01-15"
  }
}
```

The `metadata` section provides the link between the agent configuration and the ISO 42001 management system documentation: which impact assessment covers this agent, who owns the risk, when was it last reviewed.

**ISO 42001 audit evidence from UAPK:**

- Annex A.6.1 (policies): manifest = implemented policy
- Annex A.6.2 (roles): approval workflow records = named accountable individuals
- Annex A.8 (impact assessment): metadata links to assessment document
- Annex B.5.4 (provenance): manifest version history
- Clause 9 (performance): gateway deny/allow/escalate metrics over time
- Clause 10 (improvement): manifest changelog = improvement records

The audit_retention_days at 1095 (3 years) ensures records are available across multiple ISO 42001 certification cycles (certificates are typically valid 3 years with annual surveillance audits).
