# Invisible Costs: a disposable vape

ARTD6232 Creative Technologies 1 · Project 0 · Yi Han (38188163) · October 2026

A web page about one everyday object, a disposable vape, told in three scenes. Scene 1: click a part of the pixel-art vape; it moves apart and a card shows one fact about that part, with its source and a photo of the real part. Scene 2: a person. Six frames with one line each (ten cigarettes a day, quitting, the "healthier" one, the first puff, three thousand puffs a day, cannot stop); then you press the button to puff, the page flips black/white for a moment, smoke rises, a mood curve is drawn, and when the battery is empty the person throws the vape away. Scene 3: the thrown vapes keep landing on the ground until the pile catches fire. The whole page is black and white; the fire is the only colour.

## Run it

Open the folder with any local web server, for example:

```
python serve.py
```

then open http://127.0.0.1:5500/ in a browser. (The page reads JSON files with fetch, so it needs a server; opening index.html directly will not work.)

## Files

- `index.html` – the skeleton: three `<section class="scene">`, one shown at a time
- `style.css` – look (black and white, `filter: grayscale`), the flash (`filter: invert`), movement (transform), the sprite sheets (steps)
- `script.js` – scene 1: build the parts, handle clicks, fill the card
- `demo.js` – scene switching, scene 2 (frames + lines, puffs, battery, mood curve on a canvas, throw) and scene 3 (the pile, the fire)
- `data/facts.json` – the five facts: title, text, source, url, note, photo
- `assets/parts.json` and `assets/*.png` – the five pixel parts and how far each moves
- `img/` – sprite sheets (the person: `hero_sheet_8x96.png`, 8 frames of 96x96; smoke; fire), button, the board close-up
- `img/real/` – photos of real parts; sources in `img/real/SOURCES.txt`

## What is mine, what is not

- All pixel art was drawn by me in Piskel, frame by frame.
- All facts were researched by me; every card links to its source.
- The code structure follows Boyd Branch's Project 0 template. AI (Claude) helped me write and fix parts of the code and corrected my English; I rebuilt the page on the template and learned what each part does.
- Real-part photos: my own pod (photographed by me) and two teardown photos under CC BY-SA 4.0 (Wikimedia Commons, wiki.recessim.com), credited on the cards.

## Sources

See the `source` and `url` fields in `data/facts.json`.
