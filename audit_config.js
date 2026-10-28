window.AUDIT_CONFIG = {
  title: "Human Audit Template",
  instruction: "Review each item independently, answer the questions, and save before moving on.",
  storageKey: "human_audit_template_v1",
  questions: [
    {
      id: "verdict",
      type: "single_choice",
      label: "Is the proposed label supported by the evidence?",
      required: true,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "unsure", label: "Unsure" }
      ]
    },
    {
      id: "issue_types",
      type: "multiple_choice",
      label: "Which parts of the item need revision?",
      help: "Select every category that applies.",
      options: [
        { value: "source", label: "Source or evidence" },
        { value: "claim", label: "Claim wording" },
        { value: "label", label: "Gold label" },
        { value: "other", label: "Other" }
      ]
    },
    {
      id: "affected_part",
      type: "short_answer",
      label: "Which record or field is affected?",
      placeholder: "For example: evidence R4 or gold label",
      maxLength: 160
    },
    {
      id: "rationale",
      type: "long_answer",
      label: "Explain your judgment.",
      placeholder: "Briefly explain the evidence for your decision.",
      rows: 5,
      required: true
    }
  ]
};
