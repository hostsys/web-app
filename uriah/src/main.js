// import { createApp, render } from 'vue'
// import { createRouterScroller } from 'vue-router-better-scroller';
// import { nextTick } from "vue";
// import { createPinia } from 'pinia'

// import App from './App.vue'
// import router from './router'

// import "./index.css";
import "./index.css";

import axios from "axios";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

// const app = createApp(App);

// app.use(createPinia());
// app.use(router);
// app.use(createRouterScroller({
//   selectors: {
//     'body': true,
//     '#content': true
//   },
// }))

// app.mount("#app");

// BACKGROUND SCENE START

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// scene
const bgScene = new THREE.Scene();

// shape

const bgGeometry = new THREE.BufferGeometry();
const positions = [];

for (let i = 0; i < 3000; i++) {
  const particle = new THREE.Vector3(
    Math.random() * 700 - 350,
    Math.random() * 1600 - 800,
    Math.random() * 700 - 350
  );

  // particle.velocity = 0;
  // particle.acceleration = 0.02;

  positions.push(particle.x, particle.y, particle.z);

  // bgGeometry.vertices.push(particles);
}

bgGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

// bgScene.background = new THREE.Color(0x010101);

const bgTexture = new THREE.TextureLoader().load("assets/star-texture.png");
const bgMaterial = new THREE.PointsMaterial({
  sizeAttenuation: true,
  color: "white",
  size: 5,
  fog: true,
  map: bgTexture,
  transparent: true,
  // alphaTest: 0.1,
  blending: THREE.NormalBlending,
});
// console.log(bgMaterial)
const stars = new THREE.Points(bgGeometry, bgMaterial);
bgScene.fog = new THREE.Fog(0x000000, 500, 799);
bgScene.add(stars);

const bgCamera = new THREE.PerspectiveCamera(
  40,
  sizes.width / sizes.height,
  0.01,
  800
);
bgCamera.position.z = 1;
bgCamera.rotation.x = Math.PI / 2;

bgScene.add(bgCamera);

// renderererer
const canvas = document.querySelector("#bg");
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);
renderer.render(bgScene, bgCamera);

// resize
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // tell the camera
  bgCamera.aspect = sizes.width / sizes.height;
  bgCamera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// rotation q and e

let yRotation = 0;
let yRSpeed = 0.1;

// const lastControl = document.getElementById('lastControl')
// const homoControl = document.getElementById('homoControl')
// const nextControl = document.getElementById('nextControl')

// const fasterControl = document.getElementById('fasterControl')
// const leftControl = document.getElementById('leftControl')
// const rightControl = document.getElementById('rightControl')
// const slowerControl = document.getElementById('slowerControl')

document.addEventListener("DOMContentLoaded", function () {
  // const fasterControl = document.getElementById('fasterControl')
  // console.log(fasterControl)
  // fasterControl.addEventListener('touchstart', () => {
  //     tweenYRotation(-yRSpeed)
  // })
  // fasterControl.addEventListener('touchend', () => {
  //     tweenYRotation(0)
  // })
});

window.addEventListener("keydown", (downEvent) => {
  //case of q
  if (downEvent.key.toLowerCase() === "a") {
    tweenYRotation(-yRSpeed);
  } //case of e
  else if (downEvent.key.toLowerCase() === "d") {
    tweenYRotation(yRSpeed);
  }
});
// release
window.addEventListener("keyup", (upEvent) => {
  //case of q
  if (upEvent.key.toLowerCase() === "a" || upEvent.key.toLowerCase() === "d") {
    tweenYRotation(0);
  }
});

// speed w and s

let ySpeed = 5;
const ySpeedW = 10;
const ySpeedS = 3;
let speedChangeInProgress = false;

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "s" && !speedChangeInProgress) {
    tweenYSpeed(0.3, 800, TWEEN.Easing.Sinusoidal.In);
  } else if (event.key.toLowerCase() === "w" && !speedChangeInProgress) {
    tweenYSpeed(ySpeedW, 800, TWEEN.Easing.Quartic.In);
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key.toLowerCase() === "s" || event.key.toLowerCase() === "w") {
    tweenYSpeed(ySpeedS, 800, TWEEN.Easing.Sinusoidal.InOut);
  }
});

function tweenYSpeed(targetSpeed, duration, easing) {
  speedChangeInProgress = true; // Mark speed change animation in progress

  new TWEEN.Tween({ speed: ySpeed })
    .to({ speed: targetSpeed }, duration) // Transition time in milliseconds
    .easing(easing) // Use specified easing function
    .onUpdate((obj) => {
      ySpeed = obj.speed;
    })
    .onComplete(() => {
      speedChangeInProgress = false; // Reset the flag after animation completion
    })
    .start();
}

function tweenYRotation(targetRSpeed) {
  new TWEEN.Tween({ rSpeed: yRotation })
    .to({ rSpeed: targetRSpeed }, 1200) // Transition time in milliseconds
    .easing(TWEEN.Easing.Sinusoidal.InOut) // Use desired easing function
    .onUpdate((obj) => {
      yRotation = obj.rSpeed;
    })
    .start();
}

// rerenderer

// let clock = new THREE.Clock();
let delta = 0;
let interval = 1000 / 120;

function bgAnimate(timestamp) {
  // delta += clock.getDelta();

  if (timestamp - delta > interval) {
    TWEEN.update();
    // console.log( ySpeed )
    const positions = bgGeometry.getAttribute("position").array;

    for (let i = 0; i < positions.length; i += 3) {
      // let x = positions[i];
      let y = positions[i + 1];
      // let z = positions[i + 2];

      // y -= 1;
      y -= ySpeed;

      if (y < -800) {
        // y = 1000
        y = Math.random() * 101 + 800;
      }

      positions[i + 1] = y; // update the modified y-coordinate
    }
    // star rotation controls
    stars.rotation.y += yRotation;

    bgGeometry.getAttribute("position").needsUpdate = true;

    // setTimeout(function () {
    //     window.requestAnimationFrame(bgAnimate)
    // }, 1000 / 60)
    renderer.render(bgScene, bgCamera);
    delta = timestamp;
  }
  requestAnimationFrame(bgAnimate);
}
bgAnimate();

// BACKGROUND SCENE END, MENU SCENE BEGIN

// sizes
const eyeSizes = {
  width: 150,
  height: 150,
};

// scene
const eyeScene = new THREE.Scene();

// shape
const eyeShape = new THREE.IcosahedronGeometry(2, 0, 0);
const eyeMaterial = new THREE.MeshStandardMaterial({
  color: "white",
  transparent: true,
  opacity: 1.0,
  wireframe: false,
});
const eyeMesh = new THREE.Mesh(eyeShape, eyeMaterial);

const eyeOrigin = new THREE.Vector3(0, 0, 0);
eyeMesh.position.x = 0;
eyeMesh.position.z = 0;
eyeMesh.lookAt(eyeOrigin);

eyeScene.add(eyeMesh);

// camera
// const eyeCamera = new THREE.PerspectiveCamera(
//   30,
//   eyeSizes.width / eyeSizes.height,
//   0.1,
//   100
// );
const eyeCamera = new THREE.OrthographicCamera(
  eyeSizes.width / -75, // Left (adjust this value)
  eyeSizes.width / 75, // Right (adjust this value)
  eyeSizes.height / 75, // Top (adjust this value)
  eyeSizes.height / -75 // Bottom (adjust this value)
);

eyeCamera.position.z = 10;
eyeScene.add(eyeCamera);

// light
const eyeLight = new THREE.PointLight(0xffffff, 25);
eyeLight.position.set(0, 0, 10);

eyeScene.add(eyeLight);

// mouse move anim

window.addEventListener("mousemove", onmousemove, false);

const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const intersectPoint = new THREE.Vector3();

function onmousemove(event) {
  setTimeout(function () {
    // const startRotation = eyeMesh.quaternion.clone();

    mouse.x = (event.clientX / sizes.width) * 75 - 37.5;
    mouse.y = -(event.clientY / sizes.height) * 75 + -10;
    raycaster.setFromCamera(mouse, eyeCamera);
    raycaster.ray.intersectPlane(plane, intersectPoint);
    intersectPoint.z = 100; // so that the object is still always facing the camera which has a position.z of 100 too
    // eyeMesh.lookAt(intersectPoint);

    // backup original rotation
    var startRotation = new THREE.Euler().copy(eyeMesh.rotation);

    // final rotation (with lookAt)
    eyeMesh.lookAt(intersectPoint);
    var endRotation = new THREE.Euler().copy(eyeMesh.rotation);

    // revert to original rotation
    eyeMesh.rotation.copy(startRotation);

    const eyeTween = new TWEEN.Tween(eyeMesh.rotation)
      .to({ x: endRotation.x, y: endRotation.y, z: endRotation.z }, 150)
      .easing(TWEEN.Easing.Quadratic.Out);
    eyeTween.start();
  }, 150);
}

// change color theme
const root = document.documentElement;
let currentThemeIndex = 0;

function changeTheme(toTheme) {
  const theme = colorThemes[toTheme];

  const boxColor = getComputedStyle(document.documentElement).getPropertyValue(
    "--box-color"
  );

  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-secondary", theme.secondary);
  // root.style.setProperty('--color-tertiary', theme.tertiary)
  root.style.setProperty("--color-scene", theme.sceneRgb);
  root.style.setProperty("--box-color", boxColor);

  bgScene.background = new THREE.Color(...theme.scene);
  bgMaterial.color.set(...theme.stars);
  // updateVolumeButtonColors();
}

const colorThemes = {
  defaultTheme: {
    primary: "220 220 220",
    secondary: "0 0 0",
    tertiary: "100 100 100",
    scene: [0x020202],
    sceneRgb: "0 0 0",
    stars: [0xffffff],
  },
  redTheme: {
    primary: "220 50 75",
    secondary: "0 0 0",
    tertiary: "100 100 100",
    scene: [0x020202],
    sceneRgb: "0 0 0",
    stars: [0xff8c8c],
  },
  orangeTheme: {
    primary: "220 120 85",
    secondary: "0 0 0",
    tertiary: "100 100 100",
    scene: [0x020202],
    sceneRgb: "0 0 0",
    stars: [0xff9b4f],
  },
  yellowTheme: {
    primary: "220 220 100",
    secondary: "0 0 0",
    tertiary: "100 100 100",
    scene: [0x020202],
    sceneRgb: "0 0 0",
    stars: [0xdcdc0f],
  },
  greenTheme: {
    primary: "100 220 100",
    secondary: "0 0 0",
    tertiary: "100 100 100",
    scene: [0x020202],
    sceneRgb: "0 0 0",
    stars: [0x0fdc0f],
  },
  blueTheme: {
    primary: "100 100 220",
    secondary: "0 0 0",
    tertiary: "100 100 100",
    scene: [0x020202],
    sceneRgb: "0 0 0",
    stars: [0x6464dc],
  },
  indigoTheme: {
    primary: "220 100 220",
    secondary: "0 0 0",
    tertiary: "100 100 100",
    scene: [0x020202],
    sceneRgb: "0 0 0",
    stars: [0xdc64dc],
  },
};

const themes = Object.keys(colorThemes);
let gayMode = false;
let gayInterval;
const gaySpeed = 361;

const shadowElements = document.querySelectorAll("#content, #music-container");
const shadowClass = "shadow-[0_0_25px]";

changeTheme("defaultTheme");

window.addEventListener("keydown", (downEvent) => {
  const key = downEvent.key.toLowerCase();
  changeThemeByKey(key);
});

function changeThemeByKey(key) {
  if (key === "q") {
    currentThemeIndex = Math.max(currentThemeIndex - 1, 0);
    const prevTheme = themes[currentThemeIndex];
    changeTheme(prevTheme);
  } else if (key === "e") {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[currentThemeIndex];
    changeTheme(nextTheme);
  } else if (key === "r") {
    toggleGayMode();
  }
}
function toggleGayMode() {
  if (gayMode) {
    clearInterval(gayInterval);
    shadowElements.forEach((e) => {
      e.classList.remove(shadowClass);
    });
    gayMode = false;
  } else {
    shadowElements.forEach((e) => {
      e.classList.add(shadowClass);
    }, gaySpeed);
    gayInterval = setInterval(() => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      let nextTheme = themes[currentThemeIndex];
      if (nextTheme === "defaultTheme") {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        nextTheme = themes[currentThemeIndex];
        changeTheme(nextTheme);
      } else {
        changeTheme(nextTheme);
      }
    }, gaySpeed);
    gayMode = true;
  }
}

// renderererer

document.addEventListener("DOMContentLoaded", () => {
  // color change on hover
  // get header child elements
  const header = document.getElementById("header").children;

  // loop through header children
  for (let i = 0; i < header.length; i++) {
    const parent = header[i];
    // loop through header children's children
    for (let j = 0; j < parent.children.length; j++) {
      const child = parent.children[j];
      // mouseover event
      child.addEventListener("mouseover", function () {
        const itemID = this.id;
        // color cases
        switch (itemID) {
          case "home":
            eyeMaterial.color.set("purple");
            break;

          case "portfolio":
            eyeMaterial.color.set("blue");
            break;

          case "music":
            eyeMaterial.color.set("yellow");
            break;

          case "gallery":
            eyeMaterial.color.set("green");
            break;

          case "the-box":
            eyeMaterial.color.set("orange");
            break;

          case "controls":
            eyeMaterial.color.set("cyan");
            break;

          default:
            eyeMaterial.color.set("white");
        }
      });
      // mouseout event, default color
      child.addEventListener("mouseout", function () {
        // const itemID = this.id;
        eyeMaterial.color.set("white");
      });
    }
  }
  const eyeBox = document.querySelector("#eyebox");
  const eyeRenderer = new THREE.WebGLRenderer({
    canvas: eyeBox,
    alpha: true,
    antialias: false,
  });

  eyeRenderer.setPixelRatio(window.devicePixelRatio * 0.5);
  eyeRenderer.setSize(eyeSizes.width, eyeSizes.height);
  eyeRenderer.render(eyeScene, eyeCamera);

  let eyeClock = new THREE.Clock();
  let eyeDelta = 0;
  let eyeInterval = 1 / 120;

  const eyeLoop = (t) => {
    window.requestAnimationFrame(eyeLoop);
    eyeDelta += eyeClock.getDelta();

    if (eyeDelta > eyeInterval) {
      TWEEN.update(t);
      // /*  */eyeMesh.rotation.x -= 0.001

      eyeRenderer.render(eyeScene, eyeCamera);
    }
  };

  eyeLoop();
});

// anims

/* // sfx
document.addEventListener("DOMContentLoaded", () => {
  class Sfx {
    constructor(source, volume = 0.1, loop = false) {
      this.audio = new Audio(source);
      this.audio.volume = volume;
      this.audio.loop = loop;
    }

    play() {
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
        sfxElement.addEventListener("mouseenter", () =>
          enterSfx.cloneAndPlay()
        );
      } else if (
        sfxElement.parentElement.id === "volume-container" ||
        sfxElement.id === "progress-container"
      ) {
        sfxElement.addEventListener("click", () => navSfx.cloneAndPlay());
      } else {
        sfxElement.addEventListener("mouseenter", () =>
          enterSfx.cloneAndPlay()
        );
        sfxElement.addEventListener("click", () => clickSfx.cloneAndPlay());
      }
    }
  }
}); */

// music player

class Song {
  constructor(
    id,
    title,
    coverArt,
    musicFile,
    releaseDate,
    spotifyLink,
    oneLiner,
    order
  ) {
    this.id = id;
    this.title = title;
    this.coverArt = coverArt;
    this.musicFile = new Audio(musicFile);
    this.releaseDate = releaseDate;
    this.spotifyLink = spotifyLink;
    this.oneLiner = oneLiner;
    this.order = order;
    this.isPlaying = false;
  }

  play() {
    this.musicFile.play();
    this.isPlaying = true;
  }

  pause() {
    this.musicFile.pause();
    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

let songs = [];

const getMusic = async () => {
  try {
    const response = await axios.get(
      "https://uriah.website/wp-json/hs/v1/musics"
    );
    const musicData = response.data;

    songs = musicData.map(
      (songData) =>
        new Song(
          songData.id,
          songData.title,
          songData.cover_art,
          songData.music_file,
          songData.release_date,
          songData.spotify_link,
          songData.one_liner,
          songData.order
        )
    );
    const firstSongIndex = songs.findIndex((song) => song.order === 1);

    if (firstSongIndex !== -1) {
      const [desiredSong] = songs.splice(firstSongIndex, 1);
      songs.unshift(desiredSong);
    }

    // console.log(songs)
    loadSong();
  } catch (err) {
    console.log(err);
  }
};
getMusic();
// setInterval(getMusic, 5000);

let currentSongIndex = 0;
let currentSong = songs[currentSongIndex];
let currentVolume = Math.pow(0.5, 1.5);

let isDragging = false;

const playBtn = document.getElementById("play-pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const progressBar = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");

const playIcon = document.querySelector(".play-icon");
const pauseIcon = document.querySelector(".pause-icon");

const titleElement = document.getElementById("title");
const mobileTitle = document.getElementById("mobile-title");
const coverElements = document.querySelectorAll("#cover, #cover-tooltip");

playBtn.onclick = playPauseSong;
prevBtn.onclick = () => changeSong(-1);
nextBtn.onclick = () => changeSong(1);

progressContainer.addEventListener("mousedown", startDragging);
window.addEventListener("mousemove", updateDragging);
window.addEventListener("mouseup", endDragging);

const volumeButtons = document.querySelectorAll(".vol-btn");

volumeButtons.forEach((item) => {
  item.addEventListener("click", () => {
    const button = item.id;
    const btnTexts = document.querySelectorAll(".vol-btn p");
    let volume = null;

    // Remove styles from all p elements
    btnTexts.forEach((p) => {
      p.classList.remove("underline");
    });

    /*  item
      .querySelector("p")
      .classList.add(
        "underline",
        "decoration-4",
        "decoration-dotted",
        "decoration-secondary",
        "underline-offset-2"
      );
 */
    // navSfx.cloneAndPlay();

    switch (button) {
      case "volume-0":
        volume = 0;
        break;
      case "volume-25":
        volume = 0.25;
        break;
      case "volume-50":
        volume = 0.5;
        break;
      case "volume-75":
        volume = 0.75;
        break;
      case "volume-100":
        volume = 1;
        break;
    }
    setVolume(volume);
  });
});

function setVolume(volume) {
  localStorage.setItem("volume", volume);
  currentSong.musicFile.volume = volume;

  setVolumeButton(volume);
}

function setVolumeButton(volume) {
  const buttonId = `volume-${volume * 100}`;
  const button = document.getElementById(buttonId);

  const paragraph = button.querySelector("p");
  paragraph.classList.add("underline");
}

// function interpolateColor(primary, scene, percentage) {
//   const [r1, g1, b1] = primary.split(" ").map(Number);
//   const [r2, g2, b2] = scene.split(" ").map(Number);

//   const r = Math.round(r2 + r1 * (percentage / 100));
//   const g = Math.round(g2 + g1 * (percentage / 100));
//   const b = Math.round(b2 + b1 * (percentage / 100));

//   return `rgb(${r} ${g} ${b})`;
// }

// function updateVolumeButtonColors() {
//   const primaryColor = getComputedStyle(
//     document.documentElement
//   ).getPropertyValue("--color-primary");
//   const sceneColor = getComputedStyle(
//     document.documentElement
//   ).getPropertyValue("--color-scene");

//   document.querySelectorAll(".vol-btn").forEach((button, index) => {
//     const percentage = index * 17.5 + 30;
//     const backgroundColor = interpolateColor(
//       primaryColor,
//       sceneColor,
//       percentage
//     );
//     button.style.backgroundColor = backgroundColor;
//   });
// }

// updateVolumeButtonColors();

function updateProgress() {
  const { currentTime, duration } = currentSong.musicFile;
  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercent}%`;

  if (progressPercent === 100) {
    setTimeout(changeSong(1), 250);
  }
}

let downTime;
let upTime;
let deltaTime;

function startDragging(e) {
  isDragging = true;
  downTime = new Date();
  //   navSfx.cloneAndPlay();

  eventElements.forEach((e) => {
    e.style.pointerEvents = "none";
  });
  currentSong = songs[currentSongIndex];
  currentSong.pause();

  document.body.classList.add("no-select");

  playIcon.classList.remove("hidden");
  pauseIcon.classList.add("hidden");

  updateDragging(e);
}

function updateDragging(e) {
  if (!isDragging) return;

  const width = progressContainer.clientWidth;
  const clickX = e.clientX - progressContainer.getBoundingClientRect().left;
  const duration = currentSong.musicFile.duration;

  currentSong.musicFile.currentTime = (clickX / width) * duration;
}

function endDragging() {
  if (isDragging) {
    isDragging = false;
    upTime = new Date();
    deltaTime = upTime - downTime;
    if (deltaTime > 200) {
      //   navSfx.cloneAndPlay();
      console.log("delta not long enough!");
    }
    eventElements.forEach((e) => {
      e.style.pointerEvents = "auto";
    });
    document.body.classList.remove("no-select");
    playPauseSong();
  }
}

function playPauseSong() {
  currentSong = songs[currentSongIndex];
  if (currentSong.isPlaying) {
    currentSong.pause();
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
  } else {
    currentSong.play();
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");
  }
}

function changeSong(delta) {
  currentSong.musicFile.removeEventListener("timeupdate", updateProgress);
  currentSong.pause();
  currentSongIndex = (currentSongIndex + delta + songs.length) % songs.length;
  loadSong();
  playPauseSong();
}

function loadSong() {
  const volume = localStorage.getItem("volume") ?? 0.5;
  currentSong = songs[currentSongIndex];
  currentSong.musicFile.currentTime = 0;
  currentSong.musicFile.addEventListener("timeupdate", updateProgress);
  currentSong.musicFile.volume = volume;

  titleElement.innerHTML = currentSong.title;
  mobileTitle.innerHTML = currentSong.title;
  coverElements.forEach((e) => {
    e.src = currentSong.coverArt;
  });
  setVolumeButton(volume);
}

// percent scroll

document.addEventListener("DOMContentLoaded", function () {
  let content = document.getElementById("content");

  const percent = document.getElementById("percent");
  percent.style.opacity = "0";

  let maxScrollDistance = content.scrollHeight - content.clientHeight;

  window.addEventListener("load", () => {
    maxScrollDistance = content.scrollHeight - content.clientHeight;
    ensureScroll();
  });

  window.onresize = function () {
    maxScrollDistance = content.scrollHeight - content.clientHeight;
    ensureScroll();
  };
  /* 
  router.afterEach(() => {
    percent.style.opacity = "0";
    nextTick(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              setTimeout(() => {
                showOrHideScroll();
              }, 100);
            });
          });
        });
      });
    });
  });
 */
  window.addEventListener("navEvent", (e) => {
    content.scrollTop = 0;
    ensureScroll();
  });

  // this is so fucking jank
  function ensureScroll() {
    percent.style.opacity = "0";
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            setTimeout(() => {
              showOrHideScroll();
            }, 200);
          });
        });
      });
    });
  }

  function showOrHideScroll() {
    maxScrollDistance = content.scrollHeight - content.clientHeight;
    if (maxScrollDistance === 0) {
      percent.style.opacity = "0";
    } else {
      setTimeout(() => {
        percent.style.opacity = "0.4";
      }, 150);
      percent.innerHTML = "scroll";
      scrollBoxContent();
    }
  }

  // defining what should be painted in the scroll box
  function scrollBoxContent() {
    let scrollDistance = content.scrollTop;
    let progress = (scrollDistance / maxScrollDistance) * 100;
    progress = Math.max(0, Math.min(100, progress));
    percent.innerHTML = Math.round(progress) + "%";
    // console.log(Math.round(progress));

    switch (Math.round(progress)) {
      case 0:
        percent.innerHTML = "scroll";
        break;
      case 99:
        percent.innerHTML = "end";
        break;
      case 100:
        percent.innerHTML = "end";
        break;
      default:
        setTimeout(() => {
          percent.style.opacity = "0.4";
        }, 150);
      // percent.style.setProperty('--color-secondary', sceneColor)
    }
  }

  content.onscroll = scrollBoxContent;

  // start button
  const enterBtn = document.getElementById("enterBtn");
  // const enterBtnBox = document.getElementById('enterBtnBox')
  // const body = document.getElementById('contentBody')

  // // enterBtn.addEventListener('click', () => {
  // //     body.style.opacity = '1'
  // //     // // enterBtn.style.opacity = 'none';
  // //     // enterBtnBox.style.opacity = '0'
  // //     // enterBtnBox.style.zIndex = '-3'

  // //     enterBtnBox.remove()
  // //     showOrHideScroll()
  // //     playPauseSong
  // // })

  /*  enterBtn.addEventListener('click', () => {
        showOrHideScroll()
        playPauseSong
    }) */

  // body.style.opacity = '0'
  // // enterBtn.style.opacity = 'none';
  // // enterBtnBox.style.opacity = '0'
  // // enterBtnBox.style.zIndex = '-3'
  // showOrHideScroll()
});

// cursor change on click

// let cursorIsAnimating = false
const eventElements = document.querySelectorAll(
  "a, button, router-link, input, #cover, .vol-btn, #progress-container"
);
const cursorElement = document.querySelector(".cursor-default");
// let downTime
// let upTime
// let deltaTime

eventElements.forEach((e) => {
  // e.style.cursor = 'url(/cursor/cursor-active.png), default'
  // e.addEventListener('mousedown', () => {
  //     if (!cursorIsAnimating) {
  //         setTimeout(() => {
  //             console.log(e.tagName)
  //             cursorElement.style.cursor = 'url(/cursor/cursor-active-stab.png), default'
  //         }, 1)
  //     } else {
  //         return
  //     }
  // })
  // e.addEventListener('mouseenter', () => {
  //     if (!cursorIsAnimating) {
  //         setTimeout(() => {
  //             eventElements.forEach((e) => {
  //                 e.style.cursor = 'url(/cursor/cursor-active.png), default'
  //             })
  //         }, 1)
  //     } else {
  //         return
  //     }
  // })
  // e.addEventListener('mouseup', () => {
  //     if (!cursorIsAnimating) {
  //         if (e.tagName === 'A') {
  //             animationAllowed = false
  //             spinCursor()
  //             setTimeout(() => (animationAllowed = true), 10)
  //         }
  //     } else {
  //         return
  //     }
  // })
});

// function animateCursor(delta) {
//     cursorIsAnimating = true

//     delta = Math.min(delta + 5, 200)
//     togglePointerEvents()
//     console.log('animate called')
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/cursor-active.png), default'
//     }, delta * 1)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/cursor-stab.png), default'
//     }, delta * 2)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/cursor-active.png), default'
//     }, delta * 3)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/cursor-placeholder.png), default'
//         cursorIsAnimating = false
//         togglePointerEvents()
//     }, delta * 4)
// }

function animateStab(step, delta) {
  cursorIsAnimating = true;
}

function animateCursor(step, delta) {
  cursorIsAnimating = true;

  delta = Math.min(delta + 5, 200);
  console.log("animate called");
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/cursor-active.png), default";
  }, delta * 1);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/cursor-stab.png), default";
  }, delta * 2);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/cursor-active.png), default";
  }, delta * 3);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/cursor-placeholder.png), default";
    cursorIsAnimating = false;
  }, delta * 4);
}

const elems = document.querySelectorAll("*");

elems.forEach((e) => {
  e.addEventListener("animationend", () => {
    e.classList.remove("cursor-animating");
  });
});

window.addEventListener("mouseup", (e) => {
  if (
    e.target.matches(
      "*:not(button):not(#music-progress):not(#enterBtnBox):not(a):not(button svg):not(router-link):not(input):not(.vol-btn p)"
    )
  ) {
    e.target.classList.add("cursor-animating");
    // console.log('clickAnim fired')
  }
});

// function spinCursor() {
//     cursorIsAnimating = true
//     togglePointerEvents()
//     console.log('spin called')
//     const delta = 50
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/spin-1.png), default'
//     }, 1)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/spin-2.png), default'
//     }, delta * 1)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/spin-3.png), default'
//     }, delta * 2)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/spin-4.png), default'
//     }, delta * 3)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/spin-5.png), default'
//     }, delta * 4)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/spin-6.png), default'
//     }, delta * 5)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/spin-7.png), default'
//     }, delta * 6)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/spin-8.png), default'
//     }, delta * 7)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/spin-9.png), default'
//     }, delta * 8)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/spin-10.png), default'
//     }, delta * 9)
//     setTimeout(() => {
//         cursorElement.style.cursor = 'url(/cursor/cursor-placeholder.png), default'
//         cursorIsAnimating = false
//         togglePointerEvents()
//     }, delta * 10)
// }

let step = 0;
function spinCursor(step) {
  cursorIsAnimating = true;
  togglePointerEvents();
  console.log("spin called");
  const delta = 50;
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/spin-1.png), default";
  }, 1);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/spin-2.png), default";
  }, delta * 1);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/spin-3.png), default";
  }, delta * 2);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/spin-4.png), default";
  }, delta * 3);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/spin-5.png), default";
  }, delta * 4);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/spin-6.png), default";
  }, delta * 5);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/spin-7.png), default";
  }, delta * 6);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/spin-8.png), default";
  }, delta * 7);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/spin-9.png), default";
  }, delta * 8);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/spin-10.png), default";
  }, delta * 9);
  setTimeout(() => {
    cursorElement.style.cursor = "url(/cursor/cursor-placeholder.png), default";
    cursorIsAnimating = false;
    togglePointerEvents();
  }, delta * 10);
}

// function togglePointerEvents() {
//     eventElements.forEach((element) => {
//         if (!cursorIsAnimating) {
//             element.style.pointerEvents = 'auto'
//             console.log('set by js')
//         } else {
//             element.style.pointerEvents = 'none'
//             console.log('unset by js')
//         }
//     })
// }

// window.addEventListener('mousedown', () => {
//     downTime = new Date()
// })

// window.addEventListener('mouseup', () => {
//     upTime = new Date()
//     if (!cursorIsAnimating && animationAllowed) {
//         deltaTime = upTime - downTime
//         animateCursor(0, deltaTime)
//     } else {
//         cursorElement.style.cursor = 'url(/cursor/cursor-placeholder.png), default'
//     }
// })

// window.addEventListener('mouseup', (e) => {
//     // upTime = new Date()
//     // deltaTime = upTime - downTime
//     // animateCursor(0, deltaTime)

//     clickAnim()
// })

// color picker in box
// document.addEventListener("DOMContentLoaded", function () {
//   const view = document.querySelector("#view");
//   const theBox = document.querySelector("#the-box-box");

//   const colorPicker = document.querySelector("#color-picker");

//   console.log(theBox);

//   /*   theBox.addEventListener("click", () => {
//     // colorPicker.classList.toggle("hidden");
//     // colorPicker.click();
//     console.log("should be visible");
//   }) */
// });
