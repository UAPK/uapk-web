---
slug: prompt-injection-hardening
title: "Prompt-Injection Protection in UAPK Gateway: What Ships Today"
authors: [davidsanker]
tags: [uapk-gateway, ai-governance, prompt-injection, security, agent-firewall]
date: 2026-04-24
description: "Prompt injection is not a bug in any single model — it's the default state of every autonomous agent that treats content as authority. Here's how UAPK Gateway enforces the opposite assumption at the action boundary, and what specific controls just shipped."
---

A malicious sentence embedded in a webpage, a support email, or an API response can convince a language model to try something its operator never asked for: send the wrong wire, email the wrong recipient, post a secret to an attacker's URL. This is prompt injection, and it isn't fixable inside the model. It has to be fixed at the action boundary — where the model's proposal meets the outside world.

UAPK Gateway is built on that premise. **Model output is a proposal, not a command. Retrieved content is untrusted. Only the gateway decides what happens next.** Today's release hardens that boundary in ten concrete ways. This post walks through them.

<!-- truncate -->

## The five invariants

Behind the checklist of controls sit five invariants the runtime enforces in code and tests every release:

1. **Model output is a proposal.** Tool calls are validated against the agent's manifest-declared tool list. Unknown tools, malformed params, and out-of-allowlist destinations are refused before any connector runs. The default disposition on a denial is `abort` — a single denied step stops the run.

2. **Content is not authority.** Every response from an external connector is tagged with its provenance and wrapped in an untrusted-content envelope before it reaches the LLM's next turn. Workflow context carries the same tag forward, so a downstream step knows step N's output came from the outside world. An optional scrubber strips common instruction-injection tokens.

3. **The gateway is the only path out.** The runtime now refuses to boot in live mode without gateway credentials. There is no silent-ALLOW fallback in production. Every tool call passes `ActionGuard → gateway policy → connector` in that order, or it doesn't run.

4. **Approvals are tightly bound.** Override tokens are single-use, bound to the exact action they approve, scoped to the identity that requested them, and expiry-capped. Approval callbacks post only to hosts the organisation has pre-registered — or, for ad-hoc integrations, to URLs the caller has signed with their own API key. Denied callbacks never carry an override token.

5. **Every decision is auditable.** Each policy outcome, each block, each clamp, each scrub is an Ed25519-signed record on a hash-chained log. If a control fires, the forensic trail shows it.

## Ten controls shipping today

This release lands ten specific hardening tasks. Not exhaustive — the page at [uapk.info/security/prompt-injection](/security/prompt-injection) has the full picture — but the ones builders will notice first:

1. **Fail-closed recipient-domain allowlist on every SMTP connector.** An entity that hasn't declared permitted domains refuses to send. No silent wildcard.
2. **Fail-closed domain allowlist + forward-DNS + private-IP block + DNS-drift guard on every outbound HTTP connector.** Empty allowlist is a deny; resolved IPs are checked; drift between validate and connect refuses.
3. **HTTP method allowlist** — `GET / POST / PUT / PATCH / DELETE` only. `CONNECT` and `TRACE` refused.
4. **Header scrub.** LLM-supplied `Authorization`, `Host`, `Cookie`, `X-Forwarded-*`, `X-Api-Key`, `X-Real-Ip` headers are dropped before the request — they can't override the connector's identity.
5. **Response body caps** on connector output (default 1 MiB, env-configurable). Oversized responses never reach the LLM.
6. **Callback-URL allowlist** per organisation, with an HMAC-signed-URL alternative for ad-hoc destinations. The callback dispatcher itself is HTTPS-only, refuses internal targets, re-validates destinations at dispatch time.
7. **Untrusted-content envelope wrapping** of all external tool output before it reaches the LLM, with origin and tool annotations.
8. **Workflow-context provenance propagation** between steps — step N+1 knows step N's output came from outside.
9. **Destination extraction**: the gateway sees the real recipient, host, or account hoisted out of agent-supplied parameters, not an empty slot. A prompt-injected `"to": "attacker@evil.test"` fails the counterparty allowlist before anything fires.
10. **Idempotency-key dedupe** on `evaluate` and `execute` — replay with the same key returns the cached envelope; a different action hash for the same key returns `409 Conflict`.

CRLF in SMTP headers is scrubbed and multi-recipient smuggling is refused. Outbound HTTP ignores ambient proxy configuration, so process-environment variables can't redirect a connector.

## What this release does *not* claim

Being explicit about the gaps is part of the security story. Three deferred items are on the roadmap:

- **Per-tool JSON Schemas at the runtime boundary.** Today the gateway catches off-policy destinations via extraction plus policy; a formal schema layer at the agent runner is the next tightening.
- **Capability-token `max_actions` and `jti` seen-set.** Override tokens are already single-use. Capability tokens currently rely on expiry plus issuer revocation. Per-token action accounting lands next.
- **Cross-entity peer re-evaluation in fleet mode.** If one UAPK entity hands an event to another, the receiving entity's gateway will re-evaluate the payload against its own policy. Not yet enforced end-to-end.

An independent security review and a public threat-model document are scheduled for the next release train.

## Why this matters

Prompt injection is rarely the headline exploit. It's the quiet one. Nobody phishes the model directly; attackers phish the model's inputs — a webpage it was told to summarise, a support ticket it was told to triage, a document an honest user uploaded. The model helpfully complies with whatever the input tells it to do next.

The only place to stop that is at the boundary where the model's proposal turns into a real action. That's what governed execution is for. That's what the gateway does. It's not interesting when it works, which is fine — we were never trying to be interesting.

If you're building an agent and "what happens when the model obeys the wrong instruction?" is not a question you've answered with code, you have work to do. Start here: [uapk.info/security/prompt-injection](/security/prompt-injection).
