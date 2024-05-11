// sfx

// document.addEventListener("DOMContentLoaded", () => {
class Sfx {
  constructor(source, volume = 0.1, loop = false) {
    this.audio = new Audio(source);
    this.audio.volume = volume;
    this.audio.loop = loop;
  }

  play() {
    this.audio.currentTime = 0;
    this.audio.play();
  }

  cloneAndPlay() {
    const clonedAudio = new Sfx(
      this.audio.src,
      this.audio.volume,
      this.audio.loop
    );
    clonedAudio.play();
  }
}

const clickSfx = new Sfx(
  "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav"
);
const enterSfx = new Sfx(
  "http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatpellet.ogg"
);
const navSfx = new Sfx(
  "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/alien_shoot.wav"
);

const sfxElements = Array.from(
  document.querySelectorAll(
    "a, #enterBtn, button:not(.vol-btn), .vol-btn, #progress-container"
  )
);

for (let sfxElement of sfxElements) {
  if (sfxElement.id === "enterBtn") {
    sfxElement.addEventListener("click", () => {
      playPauseSong();
      clickSfx.cloneAndPlay();
    });
  } else {
    if (sfxElement.parentElement.id === "navigation") {
      sfxElement.addEventListener("click", () => navSfx.cloneAndPlay());
      sfxElement.addEventListener("mouseenter", () => enterSfx.cloneAndPlay());
    } else if (
      sfxElement.parentElement.id === "volume-container" ||
      sfxElement.id === "progress-container"
    ) {
      sfxElement.addEventListener("click", () => navSfx.cloneAndPlay());
    } else {
      sfxElement.addEventListener("mouseenter", () => enterSfx.cloneAndPlay());
      sfxElement.addEventListener("click", () => clickSfx.cloneAndPlay());
    }
  }
}

export function sfx(type) {
  if (type == "nav") {
    navSfx.play();
  }
  if (type == "click") {
    clickSfx.play();
  }
}
// });
