# Invisible Costs: a disposable vape

ARTD6232 Creative Technologies 1 · Project 0 · Yi Han (38188163) · October 2026

A web page about one everyday object, a disposable vape. On the left you click a part of a pixel-art vape; it moves apart and a card shows one fact about that part, with its source and a photo of the real part. On the right you press the button to take a puff; the battery runs down, the empty vape is thrown away, three thrown vapes catch fire, and a face shows the mood.

## Run it

Open the folder with any local web server, for example:

```
python serve.py
```

then open http://127.0.0.1:5500/ in a browser. (The page reads JSON files with fetch, so it needs a server; opening index.html directly will not work.)

## Files

- `index.html` – the skeleton: card and object on the left, stage and mood line on the right
- `style.css` – look, movement (transform), the throw (@keyframes) and the sprite sheets (steps)
- `script.js` – left side: build the parts, handle clicks, fill the card
- `demo.js` – right side: puffs, battery, throw, fire, mood
- `data/facts.json` – the five facts: title, text, source, url, note, photo
- `assets/parts.json` and `assets/*.png` – the five pixel parts and how far each moves
- `img/` – sprite sheets (smoke, fire), faces, button, screen, the board close-up
- `img/real/` – photos of real parts; sources in `img/real/SOURCES.txt`

## What is mine, what is not

- All pixel art was drawn by me in Piskel, frame by frame.
- All facts were researched by me; every card links to its source.
- The code structure follows Boyd Branch's Project 0 template. AI (Claude) helped me write and fix parts of the code and corrected my English; I rebuilt the page on the template and learned what each part does.
- Real-part photos: my own pod (photographed by me) and two teardown photos under CC BY-SA 4.0 (Wikimedia Commons, wiki.recessim.com), credited on the cards.

## Sources

See the `source` and `url` fields in `data/facts.json`.
