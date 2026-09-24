// Gallery of Inky Dollaz's work.
// Each entry is a photo ({ image }) or a video ({ video, poster? }); files live in assets/work/.
// `focus` sets which part of a photo stays visible in the cropped tile (CSS object-position);
// `cropBottom` hides a caption bar baked into the bottom of a photo (tile only — the viewer shows it all).
const WORK = [
  { title: "Memorial Portrait Sleeve",       image: "assets/work/portrait-sleeve.jpg" },
  { title: "Portrait & Script",              image: "assets/work/portrait-leg.jpg" },
  { title: "Me vs Me",                       image: "assets/work/me-vs-me.jpg" },
  { title: "Different Breed: Before", image: "assets/work/different-breed-before.jpg", focus: "60% 0%", cropBottom: true },
  { title: "Different Breed: After",  image: "assets/work/different-breed-after.jpg",  focus: "70% 0%", cropBottom: true },
];

const gallery = document.getElementById("gallery");
const player = document.getElementById("player");
const playerVideo = document.getElementById("player-video");
const playerImage = document.getElementById("player-image");
const playerCaption = document.getElementById("player-caption");
let current = 0;
let lastFocus = null;

// Build tiles. Video tiles play a muted preview on hover; photo tiles zoom slightly.
WORK.forEach((item, i) => {
  const tile = document.createElement("button");
  tile.className = "tile";
  tile.type = "button";
  tile.setAttribute("aria-label", `${item.video ? "Play video" : "View photo"}: ${item.title}`);

  let media;
  if (item.video) {
    media = document.createElement("video");
    media.src = item.video;
    media.muted = true;
    media.loop = true;
    media.playsInline = true;
    media.preload = "metadata";
    if (item.poster) media.poster = item.poster;
    tile.addEventListener("mouseenter", () => media.play().catch(() => {}));
    tile.addEventListener("mouseleave", () => { media.pause(); media.currentTime = 0; });

    const play = document.createElement("span");
    play.className = "tile-play";
    tile.append(media, play);
  } else {
    media = document.createElement("img");
    media.src = item.image;
    media.alt = item.title;
    media.loading = "lazy";
    tile.append(media);
  }
  if (item.focus) media.style.objectPosition = item.focus;
  if (item.cropBottom) tile.classList.add("crop-bottom");
  media.addEventListener("error", () => tile.classList.add("missing"));

  const label = document.createElement("span");
  label.className = "tile-label";
  label.textContent = item.title;

  tile.append(label);
  tile.addEventListener("click", () => openPlayer(i));
  gallery.appendChild(tile);
});

// Floating viewer (plays videos, shows photos)
function show(i) {
  current = (i + WORK.length) % WORK.length;
  const item = WORK[current];
  playerCaption.textContent = item.title;
  if (item.video) {
    playerImage.hidden = true;
    playerVideo.hidden = false;
    playerVideo.src = item.video;
    playerVideo.poster = item.poster || "";
    playerVideo.play().catch(() => {});
  } else {
    playerVideo.pause();
    playerVideo.removeAttribute("src");
    playerVideo.hidden = true;
    playerImage.hidden = false;
    playerImage.src = item.image;
    playerImage.alt = item.title;
  }
}

function openPlayer(i) {
  lastFocus = document.activeElement;
  player.hidden = false;
  document.body.style.overflow = "hidden";
  show(i);
  player.querySelector(".player-close").focus();
}

function closePlayer() {
  playerVideo.pause();
  playerVideo.removeAttribute("src");
  playerVideo.load();
  player.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

player.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closePlayer));
player.querySelector(".player-prev").addEventListener("click", () => show(current - 1));
player.querySelector(".player-next").addEventListener("click", () => show(current + 1));
document.addEventListener("keydown", e => {
  if (player.hidden) return;
  if (e.key === "Escape") closePlayer();
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});

// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const links = document.getElementById("nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.addEventListener("click", e => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});
