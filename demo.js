// The story in three scenes: take it apart (script.js), the person, the pile.

// ---------- 1. scenes: only one section is shown ----------
const SCENES = ["scene-parts", "scene-person", "scene-pile"];
let current = 0;
let pileStarted = false;
function show(i) {
  current = i;
  document.querySelectorAll(".scene").forEach((s) => s.classList.remove("on"));
  document.getElementById(SCENES[i]).classList.add("on");
  // Back disappears on the first scene, Next on the last
  document.getElementById("back").classList.toggle("hidden", i === 0);
  document.getElementById("next").classList.toggle("hidden", i === SCENES.length - 1);
  if (i === 2 && !pileStarted) { pileStarted = true; startPile(); }
  window.scrollTo(0, 0);
}
document.getElementById("back").addEventListener("click", () => show(current - 1));
document.getElementById("next").addEventListener("click", () => show(current + 1));
document.getElementById("end-again").addEventListener("click", () => location.reload());

// ---------- 2. frames in img/hero_sheet_8x96.png ----------
// 0 cigarette  1 pack thrown  2 vape in hand  3 half raised  4 vape + smile  5 vape + low  6 vape + flat  7 vape thrown
// DRAFT LINES: Yi Han rewrites these in his own words before the crit.
const INTRO = [
  [0, "Ten a day", "Ten cigarettes a day."],
  [1, "Quit", "I quit."],
  [2, "A better one?", "This one is 'healthier'."],
  [3, "First puff", "The first puff."],
  [4, "3,000 a day", "Three thousand puffs a day."],
  [5, "Can't stop", "I can't stop."],
];
const title = document.getElementById("person-title");
const FACE_SMILE = 4, FACE_FLAT = 6, FACE_LOW = 5, THROW = 7;

// ---------- 3. find the things on the page we will change ----------
const hero = document.getElementById("hero");
const line = document.getElementById("line");
const introNext = document.getElementById("intro-next");
const controls = document.getElementById("controls");
const moodbox = document.getElementById("moodbox");
const smoke = document.getElementById("smoke");
const button = document.getElementById("button");
const puffsEl = document.getElementById("puffs");
const thrownEl = document.getElementById("thrown");
const bar = document.getElementById("bar");
const curve = document.getElementById("curve");
const pile = document.getElementById("pile");
const fire = document.getElementById("fire");

// ---------- 4. the six opening frames: one click = next frame + next line ----------
let step = 0;
introNext.addEventListener("click", () => {
  step++;
  if (step < INTRO.length) {
    hero.style.setProperty("--f", INTRO[step][0]);
    title.textContent = INTRO[step][1];
    line.textContent = INTRO[step][2];
    return;
  }
  // after the last line: the button, the numbers and the mood curve appear
  introNext.classList.add("hidden");
  title.textContent = "One more";
  line.textContent = "Press the button.";
  hero.style.setProperty("--f", FACE_SMILE);
  controls.classList.remove("hidden");
  moodbox.classList.remove("hidden");
  setInterval(tick, 500);
});

// ---------- 5. the numbers that change (the "state") ----------
const CELLS = 5;         // one vape lasts 5 puffs here
let battery = CELLS * 10; // %
let puffs = 0;           // how many puffs in total
let thrown = 0;          // how many vapes thrown away
let mood = 50;           // 0 = worst, 100 = best
let floor = 50;          // the mood sinks back down to this
let busy = false;        // true while the throw frame is showing
const PUFF_COST = 10;
const NEXT_AT = 3;       // after this many thrown, you can go to the pile
const history = [];      // mood every half second, for the curve

// ---------- 6. pressing the button = one puff ----------
button.addEventListener("click", () => {
  if (busy || battery <= 0) return;
  puffs++;
  battery -= PUFF_COST;
  puffsEl.textContent = puffs;
  bar.textContent = "▮".repeat(battery / PUFF_COST) + "▯".repeat(CELLS - battery / PUFF_COST);
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

// ---------- 7. empty: the throw frame, then a new one is already in the hand ----------
function throwAway() {
  busy = true;
  hero.style.setProperty("--f", THROW);
  thrown++;
  thrownEl.textContent = thrown;
  floor = Math.max(10, floor - 8);   // every thrown vape drags the baseline down
  setTimeout(() => {
    battery = CELLS * 10;
    bar.textContent = "▮".repeat(CELLS);
    busy = false;
    if (thrown >= NEXT_AT) { title.textContent = "Where do they go?"; line.textContent = "Press Next → (or keep going)."; }
  }, 700);
}

// ---------- 8. every half second: the mood sinks, the face and the curve follow ----------
function tick() {
  if (mood > floor) mood = Math.max(floor, mood - 3);
  if (mood < floor) mood = Math.min(floor, mood + 3);
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

// ---------- 9. the pile: the ones you threw, then more and more, until it burns ----------
const BURN_AT = 5;
function startPile() {
  let n = 0;
  const drop = () => {
    const dead = document.createElement("img");
    dead.src = "img/vape_demo_" + (n % 3) + ".png?v=20261013b";
    dead.className = "dead bw";
    const SPOTS = [240, 150, 330, 200, 280, 120, 360, 170, 300, 230];   // a small heap under the fire
    dead.style.left = SPOTS[n % SPOTS.length] + "px";
    dead.style.bottom = (-70 + Math.floor(n / 5) * 45) + "px";
    pile.appendChild(dead);
    requestAnimationFrame(() => requestAnimationFrame(() => dead.classList.add("down")));
    n++;
    if (n < BURN_AT) setTimeout(drop, n < thrown ? 250 : 450);
    else setTimeout(burn, 900);
  };
  drop();
}

function burn() {
  fire.classList.add("play");
  document.getElementById("end-fact").classList.remove("hidden");
  document.getElementById("end-source").classList.remove("hidden");
  document.getElementById("end-again").classList.remove("hidden");
}

// ---------- 10. last: jump by hash (must come after everything above is defined) ----------
// open index.html#person or #pile to jump straight to a scene (handy when presenting)
if (location.hash === "#person") show(1);
if (location.hash === "#pile") show(2);
