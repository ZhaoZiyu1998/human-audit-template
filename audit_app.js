"use strict";

const config = window.AUDIT_CONFIG;
const items = window.AUDIT_ITEMS || [];
const state = { current: 0, reviews: {} };
const $ = id => document.getElementById(id);

function load() {
  if (!config || !Array.isArray(config.questions)) {
    throw new Error("audit_config.js must define AUDIT_CONFIG.questions");
  }
  const saved = localStorage.getItem(config.storageKey);
  state.reviews = saved ? JSON.parse(saved) : {};
  $("reviewer").value = localStorage.getItem(`${config.storageKey}:participant`) || "";
}

function persist() {
  localStorage.setItem(config.storageKey, JSON.stringify(state.reviews));
}

function currentItem() {
  return items[state.current] || null;
}

function make(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderQueue() {
  const list = $("item-list");
  list.replaceChildren();
  items.forEach((item, index) => {
    const classes = ["item-button"];
    if (index === state.current) classes.push("current");
    if (state.reviews[item.id]) classes.push("done");
    const button = make("button", classes.join(" "), item.title || item.id);
    button.type = "button";
    button.onclick = () => {
      state.current = index;
      render();
    };
    list.append(button);
  });
  const completed = items.filter(item => state.reviews[item.id]).length;
  $("progress").textContent = `${completed}/${items.length} items saved`;
}

function renderItem() {
  const item = currentItem();
  const root = $("item");
  root.replaceChildren();
  if (!item) {
    root.append(make("div", "card", "No evaluation items are configured."));
    return;
  }
  const header = make("section", "card");
  header.append(
    make("h2", null, item.title || item.id),
    make("p", "description", item.description || "")
  );
  root.append(header);

  if (Array.isArray(item.fields) && item.fields.length) {
    const card = make("section", "card");
    const fields = make("dl", "fields");
    item.fields.forEach(field => {
      fields.append(make("dt", null, field.label), make("dd", null, String(field.value ?? "")));
    });
    card.append(fields);
    root.append(card);
  }

  if (item.metadata && Object.keys(item.metadata).length) {
    const metadata = make("div", "metadata");
    metadata.textContent = Object.entries(item.metadata)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" · ");
    header.append(metadata);
  }
}

function questionLabel(question) {
  const classes = question.required ? "required" : "";
  return make("span", classes, question.label);
}

function renderChoiceQuestion(question, multiple) {
  const group = make("fieldset", "question");
  const legend = make("legend");
  legend.append(questionLabel(question));
  group.append(legend);
  if (question.help) group.append(make("div", "help", question.help));
  const choices = make("div", "choices");
  question.options.forEach(option => {
    const label = make("label", "choice");
    const input = document.createElement("input");
    input.type = multiple ? "checkbox" : "radio";
    input.name = question.id;
    input.value = option.value;
    label.append(input, document.createTextNode(option.label));
    choices.append(label);
  });
  group.append(choices);
  return group;
}

function renderTextQuestion(question, multiline) {
  const group = make("div", "question");
  const label = make("label", "question-label");
  label.htmlFor = question.id;
  label.append(questionLabel(question));
  const input = multiline ? document.createElement("textarea") : document.createElement("input");
  input.id = question.id;
  input.name = question.id;
  if (!multiline) input.type = "text";
  if (multiline) input.rows = question.rows || 4;
  if (question.placeholder) input.placeholder = question.placeholder;
  if (question.maxLength) input.maxLength = question.maxLength;
  group.append(label);
  if (question.help) group.append(make("div", "help", question.help));
  group.append(input);
  return group;
}

function renderQuestions() {
  const form = $("questions");
  form.replaceChildren();
  config.questions.forEach(question => {
    if (question.type === "mcq") {
      form.append(renderChoiceQuestion(question, false));
    } else if (question.type === "multiple_choice") {
      form.append(renderChoiceQuestion(question, true));
    } else if (question.type === "short_answer") {
      form.append(renderTextQuestion(question, false));
    } else {
      throw new Error(`Unsupported question type: ${question.type}`);
    }
  });
  fillAnswers(state.reviews[currentItem()?.id]?.answers || {});
}

function readAnswers() {
  return Object.fromEntries(config.questions.map(question => {
    if (question.type === "mcq") {
      return [question.id, document.querySelector(`input[name="${question.id}"]:checked`)?.value || ""];
    }
    if (question.type === "multiple_choice") {
      return [question.id, [...document.querySelectorAll(`input[name="${question.id}"]:checked`)].map(input => input.value)];
    }
    return [question.id, document.getElementById(question.id).value.trim()];
  }));
}

function fillAnswers(answers) {
  config.questions.forEach(question => {
    const value = answers[question.id];
    if (question.type === "mcq") {
      const selected = [...document.querySelectorAll(`input[name="${question.id}"]`)]
        .find(input => input.value === value);
      if (selected) selected.checked = true;
    } else if (question.type === "multiple_choice") {
      const selected = new Set(Array.isArray(value) ? value : []);
      document.querySelectorAll(`input[name="${question.id}"]`)
        .forEach(input => { input.checked = selected.has(input.value); });
    } else {
      document.getElementById(question.id).value = value || "";
    }
  });
}

function validate(answers) {
  for (const question of config.questions) {
    const answer = answers[question.id];
    if (question.required && (!answer || (Array.isArray(answer) && answer.length === 0))) {
      return `Please answer: ${question.label}`;
    }
  }
  return "";
}

function save() {
  const item = currentItem();
  const participant = $("reviewer").value.trim();
  const answers = readAnswers();
  const error = !participant ? "Please enter a participant name or ID." : validate(answers);
  if (error) {
    $("status").className = "status error";
    $("status").textContent = error;
    return;
  }
  state.reviews[item.id] = {
    item_id: item.id,
    participant,
    answers,
    saved_at: new Date().toISOString()
  };
  persist();
  $("status").className = "status";
  $("status").textContent = "Saved.";
  renderQueue();
}

function next() {
  if (state.current < items.length - 1) {
    state.current += 1;
    render();
  }
}

function exportJsonl() {
  const rows = items.map(item => state.reviews[item.id]).filter(Boolean);
  const content = rows.map(row => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : "");
  const url = URL.createObjectURL(new Blob([content], { type: "application/jsonl" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `evaluation_responses_${new Date().toISOString().slice(0, 10)}.jsonl`;
  link.click();
  URL.revokeObjectURL(url);
}

function render() {
  renderQueue();
  renderItem();
  renderQuestions();
  $("status").className = "status";
  $("status").textContent = state.reviews[currentItem()?.id] ? "This item has a saved response." : "";
}

document.title = config.title;
$("title").textContent = config.title;
$("instruction").textContent = config.instruction;
load();
$("reviewer").onchange = () => {
  localStorage.setItem(`${config.storageKey}:participant`, $("reviewer").value.trim());
};
$("save").onclick = save;
$("next").onclick = next;
$("export").onclick = exportJsonl;
render();
