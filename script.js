// Gallery of Inky Dollaz's work.
// Add a video: drop the .mp4 (and optional poster .jpg) into assets/work/ and add an entry here.
const WORK = [
  { title: "Custom Sleeve",     video: "assets/work/work-01.mp4", poster: "assets/work/work-01.jpg" },
  { title: "Portrait",          video: "assets/work/work-02.mp4", poster: "assets/work/work-02.jpg" },
  { title: "Script & Lettering",video: "assets/work/work-03.mp4", poster: "assets/work/work-03.jpg" },
  { title: "Black & Grey",      video: "assets/work/work-04.mp4", poster: "assets/work/work-04.jpg" },
  { title: "Chest Piece",       video: "assets/work/work-05.mp4", poster: "assets/work/work-05.jpg" },
  { title: "Fine Line",         video: "assets/work/work-06.mp4", poster: "assets/work/work-06.jpg" },
  { title: "Back Piece",        video: "assets/work/work-07.mp4", poster: "assets/work/work-07.jpg" },
  { title: "Hand & Neck",       video: "assets/work/work-08.mp4", poster: "assets/work/work-08.jpg" },
];

const gallery = document.getElementById("gallery");
const player = document.getElementById("player");
const playerVideo = document.getElementById("player-video");
const playerCaption = document.getElementById("player-caption");
let current = 0;
let lastFocus = null;

// Build tiles. Each tile shows a muted preview that plays on hover.
WORK.forEach((item, i) => {
  const tile = document.createElement("button");
  tile.className = "tile";
  tile.type = "button";
  tile.setAttribute("aria-label", `Play video: ${item.title}`);

  const preview = document.createElement("video");
  preview.src = item.video;
  preview.muted = true;
  preview.loop = true;
  preview.playsInline = true;
  preview.preload = "metadata";
  if (item.poster) preview.poster = item.poster;
  preview.addEventListener("error", () => tile.classList.add("missing"));

  const play = document.createElement("span");
  play.className = "tile-play";

  const label = document.createElement("span");
  label.className = "tile-label";
  label.textContent = item.title;

  tile.append(preview, play, label);
  tile.addEventListener("mouseenter", () => preview.play().catch(() => {}));
  tile.addEventListener("mouseleave", () => { preview.pause(); preview.currentTime = 0; });
  tile.addEventListener("click", () => openPlayer(i));
  gallery.appendChild(tile);
});

// Floating player
function show(i) {
  current = (i + WORK.length) % WORK.length;
  const item = WORK[current];
  playerVideo.src = item.video;
  playerVideo.poster = item.poster || "";
  playerCaption.textContent = item.title;
  playerVideo.play().catch(() => {});
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
