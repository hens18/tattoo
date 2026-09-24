# His Work — gallery photos & videos

The gallery is driven by the `WORK` list at the top of `script.js`. Each entry is either:

- a photo: `{ title: "Me vs Me", image: "assets/work/me-vs-me.jpg" }`
- a video: `{ title: "Custom Sleeve", video: "assets/work/sleeve.mp4", poster: "assets/work/sleeve.jpg" }`

Video tiles play a muted preview on hover; clicking any tile opens it in the floating viewer.
Tiles are cropped to 4:5 — add `focus: "70% 50%"` to an entry to choose which part of the photo stays in frame.

For the hero background, add a shop/artist photo at `assets/hero.jpg`.
