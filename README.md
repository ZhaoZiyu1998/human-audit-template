---
title: Human Audit Template
emoji: ✅
colorFrom: blue
colorTo: indigo
sdk: static
pinned: false
license: mit
---

# Human Audit Template

A dependency-free static webpage for reviewing datasets, model outputs, or annotations. Reviewers
work through a queue of items, save answers in browser `localStorage`, and export completed reviews
as JSONL.

The repository contains no completed audit results. The included records and questions are small,
fictional examples that demonstrate the data format and each supported question type.

## Question examples

The default form in [`audit_config.js`](audit_config.js) contains one example of every supported
question type:

| Type | Example question | Exported value |
| --- | --- | --- |
| `single_choice` | Is the proposed label supported by the evidence? | One option value |
| `multiple_choice` | Which parts of the item need revision? | Array of option values |
| `short_answer` | Which record or field is affected? | Single-line string |
| `long_answer` | Explain your judgment. | Multi-line string |

## Run locally

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Create an audit

1. Edit [`audit_config.js`](audit_config.js) to set the title, instructions, storage key, and
   questions.
2. Replace the examples in [`audit_items.js`](audit_items.js) with the items to review.
3. Serve the directory as a static website.

Each question needs a unique `id`, a supported `type`, and a `label`. Set `required: true` when the
reviewer must answer it before saving. A short-answer question looks like this:

```javascript
{
  id: "affected_part",
  type: "short_answer",
  label: "Which record or field is affected?",
  placeholder: "For example: evidence R4 or gold label",
  maxLength: 160
}
```

Each audit item has an `id`, display text, optional fields, and optional metadata:

```javascript
{
  id: "item-001",
  title: "Example item",
  description: "Review the evidence and proposed label.",
  fields: [
    { label: "Claim", value: "The claim shown to the reviewer." },
    { label: "Evidence", value: "The source evidence or model output." },
    { label: "Proposed label", value: "SUPPORTS" }
  ],
  metadata: { split: "test", source: "example" }
}
```

## Export format

The page exports one JSON object per reviewed item:

```json
{
  "item_id": "item-001",
  "reviewer": "reviewer-a",
  "answers": {
    "verdict": "yes",
    "issue_types": [],
    "affected_part": "",
    "rationale": "The visible record directly supports the claim."
  },
  "saved_at": "2026-10-27T12:00:00.000Z"
}
```

## Files

- `audit_config.js`: audit title, instructions, and question definitions
- `audit_items.js`: items shown to reviewers
- `audit_app.js`: rendering, validation, local storage, and JSONL export
- `index.html` and `style.css`: static page structure and presentation

## License

[MIT](LICENSE)
