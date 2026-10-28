window.AUDIT_ITEMS = [
  {
    id: "example-direct-support",
    title: "Example 1: Direct support",
    description: "Check whether the visible record supports the stated claim.",
    fields: [
      { label: "Claim", value: "Mira received 18 votes in the council election." },
      { label: "Evidence", value: "R1: candidate = Mira; event = council election; votes = 18" },
      { label: "Proposed label", value: "SUPPORTS" }
    ],
    metadata: {
      split: "example",
      source: "mock election table",
      structure: "direct"
    }
  },
  {
    id: "example-completeness",
    title: "Example 2: Completeness",
    description: "Check whether the conclusion is licensed by the stated scope.",
    fields: [
      { label: "Claim", value: "The event had fewer than four candidates." },
      { label: "Evidence", value: "R1, R2, and R3 list three distinct candidates." },
      { label: "Scope declaration", value: "All candidates in this event are shown." },
      { label: "Proposed label", value: "SUPPORTS" }
    ],
    metadata: {
      split: "example",
      source: "mock event table",
      structure: "count"
    }
  },
  {
    id: "example-conflict",
    title: "Example 3: Conflicting evidence",
    description: "Check whether both sides of the claim are established by separate records.",
    fields: [
      { label: "Claim", value: "Ari was affiliated with Group Blue." },
      { label: "Evidence account A", value: "R1: person = Ari; affiliation = Group Blue" },
      { label: "Evidence account B", value: "R2: person = Ari; affiliation = not Group Blue" },
      { label: "Proposed label", value: "BOTH" }
    ],
    metadata: {
      split: "example",
      source: "mock knowledge graph",
      structure: "conflict"
    }
  },
  {
    id: "example-unknown",
    title: "Example 4: Missing information",
    description: "Check whether an absent record leaves the claim unresolved.",
    fields: [
      { label: "Claim", value: "Noah finished before Lina." },
      { label: "Evidence", value: "R1: Noah finished at 14:20. No finish time is shown for Lina." },
      { label: "Proposed label", value: "UNKNOWN" }
    ],
    metadata: {
      split: "example",
      source: "mock schedule",
      structure: "temporal"
    }
  }
];
