// Pages 1, 3 and 4, the menu, and the scaling. (Page 2, the object, is in script.js.)

// ---------- 1. the menu: opening a page always starts it fresh ----------
// The page name sits in the address after #. Reloading the page clears every number back to zero.
const PAGES = ["start", "inside", "use", "years"];
function openPage(name) {
  location.hash = name;
  location.reload();
}
document.querySelectorAll("#menu button").forEach((b) => b.addEventListener("click", () => openPage(b.dataset.page)));
document.getElementById("reset").addEventListener("click", () => openPage(location.hash.slice(1) || "start"));

// show the page named in the address (or the first one)
const current = PAGES.includes(location.hash.slice(1)) ? location.hash.slice(1) : "start";
document.getElementById("page-" + current).classList.add("on");
document.querySelector('#menu button[data-page="' + current + '"]').classList.add("on");

// ---------- 2. scale the 1280 x 800 stage to the window (big screen = big picture) ----------
function fit() {
  const s = Math.min(window.innerWidth / 1280, window.innerHeight / 800);
  document.getElementById("app").style.transform = "scale(" + s + ")";
}
fit();
window.addEventListener("resize", fit);

// ---------- 3. the words from facts.json for pages 1 and 4 (called by script.js once the file is loaded) ----------
function fillFacts(facts) {
  const list = document.getElementById("start-facts");
  facts.filter((f) => f.page === "start").forEach((f) => {
    const li = document.createElement("li");
    li.innerHTML = "<b>" + f.title + "</b>" + f.fact + " " +
      (f.url ? '<a href="' + f.url + '" target="_blank">' + f.source + "</a>" : "");
    list.appendChild(li);
  });
  const mine = facts.find((f) => f.page === "years");
  if (mine) {
    document.getElementById("mine-fact").innerHTML = mine.fact +
      ' <a href="' + mine.url + '" target="_blank" style="color:#999">' + mine.source + "</a>";
    mineFact = mine.fact;
  }
}
let mineFact = "";

// ---------- 4. PAGE 1: six frames play by themselves, then the words ----------
// frames in the strip: 0 healthy  1 tired  2 tired  3 gone  4 gone  (Yi Han adds cigarette / pack frames when he redraws)
// Yi Han's own lines (14 Oct), grammar tidied.
const INTRO = [
  [0, "Ten a day", "Ten cigarettes in one day."],
  [0, "Gave it up", "I gave it up."],
  [0, "Healthier?", "It's healthier, they said."],
  [0, "First time", "The first time I use it."],
  [0, "3,000 a day", "3,000 puffs in one day."],
  [1, "Can't give it up", "I can't give it up."],
];
const FRAME_TIME = 1300;   // milliseconds each frame stays
if (current === "start") {
  let step = 0;
  const timer = setInterval(() => {
    step++;
    if (step < INTRO.length) {
      document.getElementById("start-hero").style.setProperty("--f", INTRO[step][0]);
      document.getElementById("start-title").textContent = INTRO[step][1];
      document.getElementById("start-line").textContent = INTRO[step][2];
    } else {
      clearInterval(timer);
      document.getElementById("start-words").classList.remove("hidden");
    }
  }, FRAME_TIME);
  document.getElementById("start-go").addEventListener("click", () => openPage("inside"));
}

// ---------- 5. PAGE 3: the button, the numbers, the mood, then the pile ----------
const FACE_SMILE = 0, FACE_FLAT = 1, FACE_LOW = 2, THROW = 2;   // frames in the strip
const hero = document.getElementById("use-hero");
const smoke = document.getElementById("smoke");
const useTitle = document.getElementById("use-title");
const useLine = document.getElementById("use-line");

const CELLS = 5;          // one vape lasts 5 puffs here
let battery = CELLS * 10; // %
let puffs = 0;            // how many puffs in total
let thrown = 0;           // how many vapes thrown away
let mood = 50;            // 0 = worst, 100 = best
let floor = 50;           // the mood sinks back down to this
let busy = false;         // true while the throw frame is showing
const PUFF_COST = 10;
const NEXT_AT = 3;        // after this many thrown, the pile button appears
const SINK = 8;           // how fast the mood sinks every half second (was 3: too slow to see the faces)
const history = [];       // mood every half second, for the curve

if (current === "use") setInterval(tick, 500);

// one press = one puff
document.getElementById("button").addEventListener("click", () => {
  if (busy || battery <= 0) return;
  puffs++;
  battery -= PUFF_COST;
  document.getElementById("puffs").textContent = puffs;
  document.getElementById("bar").textContent = "▮".repeat(battery / PUFF_COST) + "▯".repeat(CELLS - battery / PUFF_COST);
  mood = Math.min(100, mood + 20);   // a puff feels good...
  floor = Math.max(10, floor - 1);   // ...but each one lowers where you sink back to
  flash();                           // the page flips black/white
  restart(smoke, "play");            // smoke from the mouth
  if (battery <= 0) setTimeout(throwAway, 700);
});

function flash() {
  document.body.classList.add("flash");
  setTimeout(() => document.body.classList.remove("flash"), 150);
}

// Removing and re-adding a class makes its CSS animation play again from the start.
function restart(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;               // tiny trick: forces the browser to notice the removal
  el.classList.add(cls);
}

// empty: the throw frame, then a new one is already in the hand
function throwAway() {
  busy = true;
  hero.style.setProperty("--f", THROW);
  thrown++;
  document.getElementById("thrown").textContent = thrown;
  floor = Math.max(10, floor - 8);   // every thrown vape drags the baseline down
  setTimeout(() => {
    battery = CELLS * 10;
    document.getElementById("bar").textContent = "▮".repeat(CELLS);
    busy = false;
    if (thrown >= NEXT_AT) {
      useTitle.textContent = "Where do they go?";
      useLine.textContent = "Three in a week. Press the button below, or keep going.";
      document.getElementById("use-go").classList.remove("hidden");
    }
  }, 700);
}

// every half second: the mood sinks, the face and the curve follow
function tick() {
  if (mood > floor) mood = Math.max(floor, mood - SINK);
  if (mood < floor) mood = Math.min(floor, mood + SINK);
  if (!busy) {
    if (mood >= 65) hero.style.setProperty("--f", FACE_SMILE);
    else if (mood <= 35) hero.style.setProperty("--f", FACE_LOW);
    else hero.style.setProperty("--f", FACE_FLAT);
  }
  history.push(mood);
  if (history.length > 80) history.shift();
  drawCurve();
}

function drawCurve() {
  const curve = document.getElementById("curve");
  const c = curve.getContext("2d");
  const W = curve.width, H = curve.height;
  c.clearRect(0, 0, W, H);
  c.strokeStyle = "#333"; c.beginPath(); c.moveTo(0, H / 2); c.lineTo(W, H / 2); c.stroke();   // the middle line
  c.strokeStyle = "#fff"; c.lineWidth = 2; c.beginPath();
  history.forEach((m, i) => {
    const x = i * (W / 80), y = H - 10 - m * ((H - 20) / 100);
    if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
  });
  c.stroke();
  c.fillStyle = "#999"; c.font = "13px Georgia";
  c.fillText("good", 4, 14); c.fillText("low", 4, H - 4);
}

// the pile takes the person's place: the ones you threw, then more, until it burns
const BURN_AT = 5;
document.getElementById("use-go").addEventListener("click", () => {
  document.getElementById("player").classList.add("hidden");
  document.getElementById("pilebox").classList.remove("hidden");
  useTitle.textContent = "Where it ends";
  startPile();
});

function startPile() {
  const pile = document.getElementById("pile");
  let n = 0;
  const drop = () => {
    const dead = document.createElement("img");
    dead.src = "img/vape_line_" + (n % 3) + ".png?v=20261014j";
    dead.className = "dead";
    // where each one lands: x, height in the heap, and how crooked it lies
    const SPOTS = [[200, -70, 90], [310, -70, 97], [150, -46, 84], [265, -46, 102], [225, -22, 88], [120, -22, 94], [340, -22, 80]];
    const [x, y, rot] = SPOTS[n % SPOTS.length];
    dead.style.left = x + "px";
    dead.style.bottom = y + "px";
    dead.style.setProperty("--rot", rot + "deg");
    pile.appendChild(dead);
    requestAnimationFrame(() => requestAnimationFrame(() => dead.classList.add("down")));
    n++;
    if (n < BURN_AT) setTimeout(drop, n < thrown ? 250 : 450);
    else setTimeout(burn, 900);
  };
  drop();
}

function burn() {
  document.getElementById("fire").classList.add("play");
  document.getElementById("end-fact").classList.remove("hidden");
  document.getElementById("end-source").classList.remove("hidden");
}

// ---------- 6. PAGE 4: ten years, a few years a press. Me on the right, the mine on the left. ----------
// Faces: frame number in img/years_sheet_5_PLACEHOLDER_AI.png (0 healthy, 1 tired, 2 tired, 3 gone, 4 gone).
// The strip is cut from Jimeng reference images for now; Yi Han redraws the frames in Piskel and keeps the same order.
const STAGES = [
  [0, "Year 0", "Healthy."],
  [1, "Year 2", "Tired."],
  [2, "Year 5", "Can't give it up."],
  [3, "Year 8", "Ill."],          // TODO: Yi Han decides the last two words
  [4, "Year 10", "Gone."],
];
const PER_YEAR = 120;   // one every three days, from my own use
let stage = 0;
document.getElementById("years-go").addEventListener("click", async () => {
  stage++;
  const [frame, when, words] = STAGES[stage];
  const years = parseInt(when.replace("Year ", ""));
  document.getElementById("years-hero").style.setProperty("--f", frame);
  document.getElementById("years-line").textContent = when + ": " + words;
  document.getElementById("years-vapes").textContent = years * PER_YEAR;
  if (stage === STAGES.length - 1) {
    document.getElementById("years-go").classList.add("hidden");
    twoVoices();
  }
});

// the stretch: the same fact, written twice, from two sides. The model does not get the last word.
async function twoVoices() {
  document.getElementById("voices").classList.remove("hidden");
  const profit = document.getElementById("voice-profit");
  const care = document.getElementById("voice-care");
  profit.textContent = "Thinking...";
  care.textContent = "Thinking...";
  const base = "Fact: " + mineFact + "\n\n";
  const tail = " In exactly two short sentences, speaking as I. Output only the two sentences.";
  try {
    profit.textContent = await askModel(base + "You are the boss of a company that profits from this cobalt. Defend it." + tail);
    care.textContent = await askModel(base + "You are a nurse who cares for these miners. Say what you see." + tail);
  } catch (error) {
    profit.textContent = "The model could not answer (" + error.message + "). Is Ollama running?";
    care.textContent = "";
  }
}
