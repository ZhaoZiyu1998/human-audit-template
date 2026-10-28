---
title: General Human Evaluation Template
emoji: ✅
colorFrom: blue
colorTo: indigo
sdk: static
pinned: false
license: mit
---

# General Human Evaluation Template

A dependency-free static webpage for questionnaires and human-evaluation tasks. Participants work
through a queue of items, save answers in browser `localStorage`, and export completed responses as
JSONL.

**Live Space:** <https://huggingface.co/spaces/ZiyuZhao98/human-audit-template>

Clone from Hugging Face:

```bash
git clone https://huggingface.co/spaces/ZiyuZhao98/human-audit-template
```

The repository contains no collected responses. Its default page demonstrates three general
question types with ordinary, project-independent examples.

## Question examples

The default form in [`audit_config.js`](audit_config.js) contains one example of every supported
question type:

| Type | Example question | Exported value |
| --- | --- | --- |
| `mcq` | Which planet is the largest in the Solar System? | One option value |
| `multiple_choice` | Which of the following are programming languages? | Array of option values |
| `short_answer` | Describe one benefit of reproducible research. | Short text string |

## Run locally

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Create an evaluation

1. Edit [`audit_config.js`](audit_config.js) to set the title, instructions, storage key, and
   questions.
2. Replace the examples in [`audit_items.js`](audit_items.js) with the items to review.
3. Serve the directory as a static website.

Each question needs a unique `id`, a supported `type`, and a `label`. Set `required: true` when the
participant must answer it before saving. A short-answer question looks like this:

```javascript
{
  id: "reproducibility_benefit",
  type: "short_answer",
  label: "In one or two sentences, describe one benefit of reproducible research.",
  placeholder: "Type a short response.",
  maxLength: 240
}
```

Each evaluation item has an `id`, display text, optional fields, and optional metadata:

```javascript
{
  id: "item-001",
  title: "Example question set",
  description: "Answer the questions shown in the form.",
  fields: [
    { label: "Instructions", value: "Read the questions and save one response." }
  ],
  metadata: { category: "example" }
}
```

## Export format

The page exports one JSON object per completed item:

```json
{
  "item_id": "general-question-examples",
  "participant": "participant-a",
  "answers": {
    "largest_planet": "jupiter",
    "programming_languages": ["python", "java"],
    "reproducibility_benefit": "Other researchers can verify and extend the result."
  },
  "saved_at": "2026-10-27T12:00:00.000Z"
}
```

## Files

- `audit_config.js`: page title, instructions, and question definitions
- `audit_items.js`: items shown to participants
- `audit_app.js`: rendering, validation, local storage, and JSONL export
- `index.html` and `style.css`: static page structure and presentation

## License

[MIT](LICENSE)
