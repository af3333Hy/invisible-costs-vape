// RIGHT PANEL: use the vape, throw it away, watch the mood.

// 1. The numbers that change (the "state")
let battery = 70;        // % shown on the screen
let puffs = 0;           // how many puffs in total
let thrown = 0;          // how many vapes are on the ground right now
let round = 0;           // how many piles have burned
let mood = 50;           // 0 = worst, 100 = best; starts in the middle
let floor = 50;          // the mood slowly sinks back down to this
let busy = false;        // true while the vape is flying or the pile is burning

const PUFF_COST = 10;    // battery lost per puff
const FIRE_AT = 3;       // the pile catches fire when this many are thrown
const COLOURS = ["img/vape_demo_0.png?v=20261012d", "img/vape_demo_1.png?v=20261012d", "img/vape_demo_2.png?v=20261012d"];

// 2. Find the things on the page we will change
const vape = document.getElementById("vape");
const body = document.getElementById("body");
const smoke = document.getElementById("smoke");
const screen = document.getElementById("screen");
const button = document.getElementById("button");
const pile = document.getElementById("pile");
const fire = document.getElementById("fire");
const face = document.getElementById("face");

// 3. Pressing the button = one puff
button.addEventListener("click", () => {
  if (busy || battery <= 0) return;
  puffs++;
  battery -= PUFF_COST;
  screen.textContent = battery;
  mood = Math.min(100, mood + 20);   // a puff feels good...
  floor = 35;                        // ...but from now on the mood sinks lower than before
  playSmoke();
  restart(vape, "puff");             // small kick
  screen.classList.add("flash"); setTimeout(() => screen.classList.remove("flash"), 120);
  if (battery <= 0) setTimeout(throwAway, 900);   // empty: throw it after the last puff
});

// 4. Smoke: restart the 6-frame animation
function playSmoke() { restart(smoke, "play"); }

// Removing and re-adding a class makes its CSS animation play again from the start.
function restart(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;               // tiny trick: forces the browser to notice the removal
  el.classList.add(cls);
}

// 5. Throw the empty vape on the ground, then hand over a new one
// three resting places (left, bottom inside #pile): two on the ground, one on top
const SPOTS = [[10, -70], [200, -70], [100, -10]];

function throwAway() {
  busy = true;
  const [x, y] = SPOTS[thrown % FIRE_AT];
  // where the flying vape must end up so that it lands exactly on its resting place
  vape.style.setProperty("--tx", (x + 80 - 520) + "px");
  vape.style.setProperty("--ty", (60 - y) + "px");
  vape.classList.add("thrown");
  vape.addEventListener("animationend", function landed(e) {
    // the smoke's animation also ends inside #vape: only react to the throw itself
    if (e.animationName !== "throw") return;
    vape.removeEventListener("animationend", landed);
    // leave a copy lying on the ground
    const dead = document.createElement("img");
    dead.src = body.src;
    dead.className = "dead";
    dead.style.left = x + "px";
    dead.style.bottom = y + "px";
    pile.appendChild(dead);
    thrown++;

    // a new vape, new colour, full battery
    vape.classList.remove("thrown");
    body.src = COLOURS[(thrown + round) % COLOURS.length];
    battery = 70;
    screen.textContent = battery;
    busy = false;

    if (thrown === FIRE_AT) burn();
  });
}

// 6. The pile catches fire: mood crashes and stays low; then the ground is cleared and it all starts again
function burn() {
  busy = true;
  fire.classList.add("play");
  mood = 0;
  floor = 20;
  fire.addEventListener("animationend", () => {
    fire.classList.remove("play");
    pile.classList.add("cleared");                 // fade the burnt vapes out
    setTimeout(() => {
      pile.innerHTML = "";
      pile.classList.remove("cleared");
      thrown = 0;
      round++;
      busy = false;
    }, 900);
  }, { once: true });
}

// 7. Every half second: the mood sinks towards the floor, and the face follows
setInterval(() => {
  if (mood > floor) mood = Math.max(floor, mood - 3);
  if (mood < floor) mood = Math.min(floor, mood + 3);
  face.style.top = (300 - mood * 3) + "px";            // 100 -> top of the track, 0 -> bottom
  if (mood >= 65) face.src = "img/08_face_smile.png?v=20261012d";
  else if (mood <= 35) face.src = "img/08_face_sad.png?v=20261012d";
  else face.src = "img/08_face_flat.png?v=20261012d";
}, 500);
