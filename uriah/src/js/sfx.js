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

const longSfx = new Sfx(
  "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav"
);
const hoverSfx = new Sfx(
  "http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatpellet.ogg"
);
const shortSfx = new Sfx(
  "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/alien_shoot.wav"
);

document.addEventListener("click", (e) => {
  const { target } = e;
  if (
    target.matches("a") ||
    (target.matches("button") &&
      !target.matches(".vol-btn") &&
      !target.matches(".exempt"))
  ) {
    sfx("long");
  }
});
document.addEventListener("mouseover", (e) => {
  const { target } = e;
  if (target.matches("a")) {
    hoverSfx.cloneAndPlay();
  }
});

export function sfx(type) {
  if (type == "short") {
    shortSfx.play();
  }
  if (type == "long") {
    longSfx.play();
  }
  if (type == "hover") {
    hoverSfx.play();
  }
}
