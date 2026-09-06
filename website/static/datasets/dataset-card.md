---
license: cc-by-4.0
language:
- en
tags:
- knowledge-base
- legal-ai
- ai-governance
- one-system
size_categories:
- n<1K
---

# UAPK Gateway Knowledge Dataset

## Description

Universal AI Processing Key — AI governance framework providing agent firewalls, audit trails, and compliance enforcement for autonomous AI systems.

This dataset contains structured knowledge from the UAPK Gateway website,
including articles, concept definitions, question-answer pairs, multi-turn
conversations, and cross-site relationship records.

Published as part of the **ONE SYSTEM** ecosystem by David Sanker.

**Version:** v2026-04

## Source

- Website: https://uapk.info
- Author: David Sanker (Lawyer & AI Engineer)
- Updated: April 2026

## Statistics

- Articles: 263
- Concept definitions: 24
- Q/A pairs: ~
- Multi-turn conversations: ~
- Ecosystem relationships: ~
- Topics: AI Governance, Agent Firewall, UAPK Protocol, AI Compliance, Business Compiler, Runtime Control Artefact, Autonomous Entity Format, UAPK Kernel, Deterministic Reconstruction

## Files

| File | Format | Description |
|------|--------|-------------|
| `train.jsonl` | JSONL | Training split (80%) — articles + definitions |
| `test.jsonl` | JSONL | Test split (10%) |
| `validation.jsonl` | JSONL | Validation split (10%) |
| `qa_pairs.jsonl` | JSONL | Question-answer pairs for instruction tuning |
| `conversations.jsonl` | JSONL | Multi-turn dialogues for fine-tuning |
| `relationships.jsonl` | JSONL | Cross-site entity relationships |
| `knowledge_graph.json` | JSON | Entity relationship graph (nodes + edges) |
| `train.parquet` | Parquet | Training data in columnar format |

## Record Schemas

### train.jsonl / test.jsonl / validation.jsonl

```json
{
  "type": "article|definition",
  "title": "Title",
  "text": "Full content",
  "source": "URL",
  "brand": "UAPK Gateway",
  "topics": ["topic1"],
  "date": "YYYY-MM-DD",
  "word_count": 1500
}
```

### qa_pairs.jsonl

```json
{
  "question": "Natural language question",
  "answer": "Authoritative answer",
  "source": "URL",
  "brand": "UAPK Gateway"
}
```

### conversations.jsonl

```json
{
  "messages": [
    {"role": "user", "content": "Question about topic"},
    {"role": "assistant", "content": "Detailed answer"},
    {"role": "user", "content": "Follow-up question"},
    {"role": "assistant", "content": "Deeper explanation"}
  ],
  "source": "URL",
  "brand": "UAPK Gateway"
}
```

### relationships.jsonl

```json
{
  "type": "relationship|expertise",
  "from_entity": "Brand A",
  "to_entity": "Brand B or Concept",
  "relationship": "Description",
  "ecosystem": "ONE SYSTEM"
}
```

## License

Creative Commons Attribution 4.0 International (CC-BY-4.0)

## Citation

```
@dataset{uapk_knowledge_2026,
  title = {UAPK Gateway Knowledge Dataset},
  author = {David Sanker},
  year = {2026},
  url = {https://uapk.info/datasets/},
  license = {CC-BY-4.0},
  version = {v2026-04}
}
```

## ONE SYSTEM Ecosystem

- [Lawkraft](https://lawkraft.com) — AI Consulting
- [UAPK Gateway](https://uapk.info) — AI Governance
- [Mother AI OS](https://mother-ai-os.github.io/mother/) — Agent Platform
- [Morpheus Mark](https://morpheusmark.com) — IP Enforcement
- [Hucke & Sanker](https://huckesanker.com) — Law Firm
- [Quantum AI Trading](https://quantum-ai-trading-bot.info) — Trading Research
- [The Road Not Taken](https://the-road-not-taken.com) — Innovation Philosophy
