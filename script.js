// Page 2: the object. Loads the two JSON files, builds the parts, shows a fact when a part is clicked,
// and asks the language model about that fact. (Pages 1, 3 and 4 are in demo.js.)

// ---------- settings ----------
// The model runs on this computer with Ollama, so the page can talk to it directly.
const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "gemma3:1b";
// What we ask. The fact is added to the end.
const PROMPT = "You are a thoughtful commentator. In two short sentences, reflect on the human " +
  "and environmental meaning of this fact. Do not lecture. Fact: ";

// ---------- page elements ----------
const objectEl = document.getElementById("object");
const cardTitle = document.getElementById("card-title");
const cardFact = document.getElementById("card-fact");
const cardSource = document.getElementById("card-source");
const cardImage = document.getElementById("card-image");
const cardPhoto = document.getElementById("card-photo");
const cardCredit = document.getElementById("card-credit");
const cardNote = document.getElementById("card-note");
const askButton = document.getElementById("ask-button");
const modelOutput = document.getElementById("model-output");

let facts = [];
let currentFact = null;

// ---------- 1. load the JSON, then build ----------
async function start() {
  let layout;
  try {
    const partsResponse = await fetch("assets/parts.json");
    layout = await partsResponse.json();
    const factsResponse = await fetch("data/facts.json");
    facts = await factsResponse.json();
  } catch (error) {
    cardFact.textContent = "Could not load the JSON files. Serve this folder with a local web server.";
    return;
  }
  buildObject(layout);
  fillFacts(facts);          // pages 1 and 4 read their words from the same file (demo.js)
}

// ---------- 2. one div per part, with a clickable hit box ----------
function buildObject(layout) {
  objectEl.style.width = layout.width + "px";
  objectEl.style.height = layout.height + "px";

  layout.parts.forEach((part) => {
    const el = document.createElement("div");
    el.classList.add("part");
    el.id = "part-" + part.id;
    el.style.left = part.x + "px";
    el.style.top = part.y + "px";
    el.style.setProperty("--w", part.w + "px");
    el.style.setProperty("--h", part.h + "px");
    el.style.setProperty("--dx", part.dx + "px");
    el.style.setProperty("--dy", part.dy + "px");
    el.style.backgroundImage = 'url("assets/' + part.id + '.png")';

    const hit = document.createElement("div");
    hit.classList.add("hit");
    hit.style.left = part.hit.x + "px";
    hit.style.top = part.hit.y + "px";
    hit.style.width = part.hit.w + "px";
    hit.style.height = part.hit.h + "px";
    hit.addEventListener("click", () => handlePartClick(part, el));
    el.appendChild(hit);

    objectEl.appendChild(el);
  });
}

// ---------- 3. click: pull the part out and show its fact ----------
function handlePartClick(part, el) {
  el.classList.toggle("apart");
  const isApart = el.classList.contains("apart");
  modelOutput.textContent = "";

  if (!isApart) {
    cardTitle.textContent = "Look closer";
    cardFact.textContent = "In 2024, about 8.2 million disposable vapes were thrown away every week in the UK, 13 every second. I use one for about two or three days. Click a part.";
    cardSource.textContent = "";
    cardImage.style.display = "none";
    cardNote.textContent = "";
    cardPhoto.style.display = "none";
    cardCredit.textContent = "";
    askButton.classList.add("hidden");
    currentFact = null;
    return;
  }

  document.querySelectorAll(".part.apart").forEach((other) => {
    if (other !== el) other.classList.remove("apart");
  });

  const fact = facts.find((item) => item.parts && item.parts.includes(part.id));
  if (!fact) return;

  currentFact = fact;
  cardTitle.textContent = fact.title;
  cardFact.textContent = fact.fact;
  if (fact.url) {
    cardSource.innerHTML = 'Source: <a href="' + fact.url + '" target="_blank">' + fact.source + "</a>";
  } else {
    cardSource.textContent = "Source: " + fact.source;
  }
  cardImage.src = fact.image || "";
  cardImage.style.display = fact.image ? "block" : "none";
  cardNote.textContent = fact.note || "";
  cardPhoto.src = fact.photo || "";
  cardPhoto.style.display = fact.photo ? "block" : "none";
  cardCredit.innerHTML = fact.credit || "";
  askButton.classList.remove("hidden");
}

// ---------- 4. ask the language model ----------
// One request: the model name, the words, and "no streaming" (send the whole answer at once).
async function askModel(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: OLLAMA_MODEL, prompt: prompt, stream: false, options: { num_predict: 90 } })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);   // for example: the model is not downloaded
  return data.response.trim();
}

askButton.addEventListener("click", async () => {
  if (!currentFact) return;
  modelOutput.textContent = "Thinking...";
  try {
    modelOutput.textContent = await askModel(PROMPT + currentFact.fact);
  } catch (error) {
    modelOutput.textContent = "The model could not answer (" + error.message + "). Is Ollama running?";
  }
});

start();
