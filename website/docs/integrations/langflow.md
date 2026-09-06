---
sidebar_position: 4
title: Langflow
description: Use UAPK Gateway components in Langflow AI pipelines
---

# Langflow Integration

The `uapk-langflow` package adds UAPK Gateway components to Langflow's visual pipeline builder. Drop them into any flow to enforce policies and log every agent action — no code changes required.

## Installation

```bash
pip install uapk-langflow
```

Restart Langflow. The **UAPK Gateway** components appear automatically in the component palette under the UAPK category.

:::tip PyPI package
Published at [pypi.org/project/uapk-langflow](https://pypi.org/project/uapk-langflow)
:::

## Components

### UAPK Gateway: Evaluate

Checks an action against your policies without executing it. Use as a gate before any tool call in your flow.

**Inputs:**
- Gateway URL, Org ID, API Key
- UAPK ID, Agent Instance ID, Action Type, Tool
- Parameters (JSON), Counterparty details (optional), Amount (optional)

**Outputs:** `decision` (`allow`/`deny`/`escalate`), full evaluation response

### UAPK Gateway: Execute

Evaluates the policy and executes the action if allowed. Returns the connector's result alongside the policy decision.

**Inputs:** Same as Evaluate, plus optional Override Token for re-submitting an approved escalation.

**Outputs:** Execution result, decision, approval ID (if escalated)

## Quickstart

1. Add the **UAPK Gateway: Execute** component to your flow
2. Connect your agent's action output to its inputs
3. Connect the component's `decision` output to a **Router** or **Conditional** component
4. Route `allow` → continue, `deny` → stop/alert, `escalate` → human approval step

## Setup

Create credentials by filling in:

| Field | Where to find it |
|-------|-----------------|
| **Gateway URL** | `https://api.uapk.info` or your self-hosted URL |
| **Organization ID** | UAPK Dashboard → Settings → Organization ID |
| **API Key** | UAPK Dashboard → Settings → API Keys |
