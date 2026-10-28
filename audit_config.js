window.AUDIT_CONFIG = {
  title: "General Human Evaluation Template",
  instruction: "Answer each question and save the response before moving on.",
  storageKey: "general_human_evaluation_template_v1",
  questions: [
    {
      id: "largest_planet",
      type: "mcq",
      label: "Which planet is the largest in the Solar System?",
      required: true,
      options: [
        { value: "earth", label: "Earth" },
        { value: "mars", label: "Mars" },
        { value: "jupiter", label: "Jupiter" },
        { value: "venus", label: "Venus" }
      ]
    },
    {
      id: "programming_languages",
      type: "multiple_choice",
      label: "Which of the following are programming languages?",
      help: "Select all that apply.",
      required: true,
      options: [
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "html", label: "HTML" },
        { value: "css", label: "CSS" }
      ]
    },
    {
      id: "reproducibility_benefit",
      type: "short_answer",
      label: "In one or two sentences, describe one benefit of reproducible research.",
      placeholder: "Type a short response.",
      maxLength: 240,
      required: true
    }
  ]
};
