# Invisible Costs: a disposable vape

ARTD6232 Creative Technologies 1 · Project 0 · Yi Han (38188163) · October 2026

A web page about one everyday object, a disposable vape, in four pages. A menu at the top opens one page at a time; opening a page always starts it fresh. The whole site is black and white; the fire on page 3 is the only colour.

1. **Start** – six frames play by themselves, one line each: ten cigarettes a day, giving up, "healthier", the first puff, three thousand puffs a day, cannot give it up. Then the facts behind the lines.
2. **Inside** – click a part of the pixel vape; it moves apart and a card shows one fact about that part, with its source and a photo of the real part. "Ask the model" sends the fact to a small language model running on this computer and shows its two sentences.
3. **Use** – press the button to puff: the page flips black/white for a moment, smoke rises, a mood curve is drawn. When the battery is empty the vape is thrown away. After three, the thrown vapes pile up on the ground until the pile catches fire.
4. **Thirty years** – one press is five years. Three miners dig on the left; on the right my face goes calm, tired, then gone. At the end two sides of the same fact can be asked for, one button each: a company boss and a nurse.

## Run it

Open the folder with any local web server, for example:

```
python serve.py
```

then open http://127.0.0.1:5500/ in a browser. (The page reads JSON files with `fetch`, so it needs a server; opening `index.html` directly will not work.)

The "Ask" buttons talk to [Ollama](https://ollama.com) on the same computer (`http://localhost:11434`, model `gemma3:1b`). Without Ollama everything else works; the buttons just say the model could not answer.

## Files

- `index.html` – the skeleton: a menu and four `<section class="page">`, one shown at a time
- `style.css` – look (black and white, `filter: grayscale`), the flash (`filter: invert`), movement (`transition`), the sprite sheets (`steps()`), the 1280×800 stage scaled to the window
- `script.js` – page 2: build the parts, handle clicks, fill the card, talk to the model
- `demo.js` – the menu and scaling, page 1 (frames + lines), page 3 (puffs, battery, mood curve on a canvas, throw, pile, fire), page 4 (years, faces, two voices)
- `data/facts.json` – the facts: title, text, source, url, note, photo; which page or part each belongs to
- `assets/parts.json` and `assets/*.png` – the five pixel parts and how far each moves
- `img/` – sprite sheets, all drawn in Piskel: `smoker_6b_288x128.png` (page 1, six frames), `use_old4x600x128.png` (page 3, four frames), `years_3x288x128.png` (page 4, three faces), `miners_4x116x224.png` (page 4, four frames), smoke, fire, the button, the three thrown vapes, the board close-up
- `img/real/` – photos of real parts; sources in `img/real/SOURCES.txt`

## What is mine, what is not

- All pixel art was drawn by me in Piskel, frame by frame. No AI images are used on the site.
- All facts were researched by me; every card links to its source.
- The code structure follows Boyd Branch's Project 0 template. AI (Claude) helped me write and fix parts of the code and corrected my English; I rebuilt the page on the template and learned what each part does.
- Commits marked "Co-Authored-By: Claude" are the ones where AI helped write or fix code. After each one I went through the change, rebuilt it on the template and can explain what it does.
- The two-sentence reflections on pages 2 and 4 are written live by a local language model (Ollama, gemma3:1b) when a button is pressed; nothing is generated otherwise.
- Real-part photos: my own pod (photographed by me) and two teardown photos under CC BY-SA 4.0 (Wikimedia Commons, wiki.recessim.com), credited on the cards.

## Sources

See the `source` and `url` fields in `data/facts.json`.
