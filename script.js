const objectEl = document.getElementById("object");
  const cardTitle = document.getElementById("card-title");
  const cardFact = document.getElementById("card-fact");
  const cardSource = document.getElementById("card-source");
  const cardImage = document.getElementById("card-image");
  const cardPhoto = document.getElementById("card-photo");
  const cardCredit = document.getElementById("card-credit");
  const cardNote = document.getElementById("card-note");

  let facts = [];
  let currentFact = null;
  async function start() {
    let layout;
    try {
      const partsResponse = await fetch("assets/parts.json");
      layout = await partsResponse.json();
      const factsResponse = await fetch("data/facts.json");
      facts = await factsResponse.json();
    } catch (error) {
      cardFact.textContent =
        "Could not load the JSON files. Serve this folder with a local web server.";
      return;
    }
    buildObject(layout);
  }

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
  function handlePartClick(part, el) {
    el.classList.toggle("apart");
    const isApart = el.classList.contains("apart");

    if (!isApart) {
      cardTitle.textContent = "Look closer";
      cardFact.textContent = "In 2024, about 8.2 million disposable vapes were thrown away every week in the UK, 13 every second. I use one for about two or three days. So where does it go next? Click a part.";
      cardSource.textContent = "";
      cardImage.style.display = "none";
      cardNote.textContent = "";
      cardPhoto.style.display = "none";
      cardCredit.textContent = "";
      currentFact = null;
      return;
    }

    document.querySelectorAll(".part.apart").forEach((other) => {
      if (other !== el) {
        other.classList.remove("apart");
      }
    });

    const fact = facts.find((item) => item.parts.includes(part.id));
    if (!fact) {
      return;
    }

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
  }
  start();