<div align="center">

# watch-tail · hype video

**A 30-second, manga-style trailer for [watch-tail](https://github.com/antstanley/watch-tail), drawn frame by frame with p5.js.**

<a href="video/watch-tail-hype-manga-720p.mp4"><img src="video/poster.jpg" alt="The end card: the watch-tail puppy next to the watch-tail logo, 'Tail logs. Wag tails.' and npx watch-tail" width="960"></a>

[720p, 9.7 MB](video/watch-tail-hype-manga-720p.mp4) · [1080p60 original, 79 MB](video/watch-tail-hype-manga.mp4)

</div>

## What's in it

| Time | Scene |
| --- | --- |
| 0–3.5s | 3:07 AM. Production is on fire. A phone buzzes, `npx watch-tail` is typed, and an ink blot takes over. |
| 3.5–7.5s | Logs stream past at full speed: **TAIL YOUR LOGS**, **LIVE!**, **EVERY SINGLE LINE.** |
| 7.5–11.7s | The stream freezes, the error line is pulled out, and a hand-drawn chart circles the spike. |
| 11.7–17.2s | The puppy drops in. **EVERY TAIL DESERVES A WAG.** |
| 17.2–24.7s | A four-panel page fills up: live tail, historic views, grouping by request, and MCP for your agent. |
| 24.7–30s | The end card, a hanko seal, and a sepia *To Be Continued*. |

## How it's drawn

Everything is one p5.js sketch in [`index.html`](index.html). Each frame is a pure function of time,
`renderAt(t)`, so any moment can be rendered on its own.

- **Ink.** Every line is a filled ribbon whose width breathes with Perlin noise and tapers at the
  ends, so it reads as a brush stroke rather than a vector line.
- **Line boil.** The noise field moves on 12 times a second, so lines wobble slightly from drawing
  to drawing, the way hand-drawn animation does.
- **Screentone.** Shading uses halftone dot patterns kept at screen scale, whatever the zoom.
- **Manga grammar.** Focus lines (集中線), speed lines, slanted panels, burst and speech balloons,
  and sound effects lettered in Bangers and Dela Gothic One.
- **The puppy.** The watch-tail puppy, re-inked from the app's own geometry
  ([`puppy-geometry.ts`](puppy-geometry.ts), copied from watch-tail). Its SVG paths are resampled
  into points so they can boil like everything else.

## Make it yourself

Requires Node.js 22+ and ffmpeg. [Bun](https://bun.sh) is only needed to regenerate `puppy.json`.

```bash
npm install
npx playwright install chromium-headless-shell

npm run preview          # http://localhost:8000/ loops it; ?t=12.3 holds one frame
npm run stills -- 3.5 13.2   # PNG frames in stills/
npm run render           # video/watch-tail-hype-manga.mp4, 1080p60 (about 2 minutes)
npm run encode           # video/watch-tail-hype-manga-720p.mp4, the small copy
npm run puppy            # rebuild puppy.json from puppy-geometry.ts
```

Timings live in the `TL` and `FT` constants at the top of the script, and each scene is its own
`act1` … `act6` function.

## License

[MIT](LICENSE). Fonts are from [Fontsource](https://fontsource.org) under the SIL Open Font License.
