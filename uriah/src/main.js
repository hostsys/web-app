import axios from "axios";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as TWEEN from "@tweenjs/tween.js";

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

const bgTexture = new THREE.TextureLoader().load("star-texture.png");
const bgMaterial = new THREE.PointsMaterial({
  sizeAttenuation: true,
  color: "white",
  size: 5,
  fog: true,
  map: bgTexture,
  transparent: true,
  alphaTest: 0.9,
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
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
// renderer.premultipliedAlpha = false;

// renderer.setPixelRatio(window.devicePixelRatio);
renderer.setPixelRatio(window.devicePixelRatio / 3);
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
const ySpeedS = 5;
let speedChangeInProgress = false;

window.addEventListener("controlEvent", (e) => {
  const directive = e.detail.directive;
  cameraControls(directive);
});

function cameraControls(directive) {
  if (directive === "faster")
    tweenYSpeed(ySpeedW, 800, TWEEN.Easing.Quartic.In);
  if (directive === "slower") tweenYSpeed(0.3, 800, TWEEN.Easing.Sinusoidal.In);
  if (directive === "stop")
    tweenYSpeed(ySpeedS, 800, TWEEN.Easing.Sinusoidal.InOut);
  if (directive === "left") tweenYRotation(-yRSpeed);
  if (directive === "right") tweenYRotation(yRSpeed);
  if (directive === "stopR") tweenYRotation(0);
}

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
const loader = new GLTFLoader();
let eyeMesh;
let mixer;
loader.load(
  "../../assets/models/eyeball.glb",
  function (gltf) {
    gltf.scene.scale.set(1.8, 1.8, 1.8);
    gltf.scene.castShadow = true;

    eyeMesh = gltf.scene;

    // eyeScene.add(gltf.scene);
    // loadedModel = gltf.scene;
    // const eyeOrigin = new THREE.Vector3(0, 0, 0);
    // eyeMesh.position.x = 0;
    // eyeMesh.position.z = 0;
    // eyeMesh.rotation.x = 90;
    // eyeMesh.lookAt(eyeOrigin);

    eyeScene.add(eyeMesh);
  },
  undefined,
  function (error) {
    console.log(error);
  }
);
let action, action1; // Declare variables for the actions

let lidMesh;
loader.load(
  "../../assets/models/eyelids.glb",
  function (gltf) {
    gltf.scene.scale.set(1.8, 1.8, 1.8);
    gltf.scene.castShadow = true;
    lidMesh = gltf.scene;
    eyeScene.add(lidMesh);

    mixer = new THREE.AnimationMixer(gltf.scene);
    const anims = gltf.animations;

    const blinkTop = THREE.AnimationClip.findByName(anims, "Action");
    const blinkBot = THREE.AnimationClip.findByName(anims, "Action.002");

    // Store the actions in the global variables
    action = mixer.clipAction(blinkTop);
    action1 = mixer.clipAction(blinkBot);

    // Optionally, play the animations initially or keep them paused for later use
    action.clampWhenFinished = true; // Stop at the last frame
    action.loop = THREE.LoopOnce; // Play the animation once
    action1.clampWhenFinished = true;
    action1.loop = THREE.LoopOnce;

    // Initially, don't play them if you want to control them externally
    // action.play();
    // action1.play();
  },
  undefined,
  function (error) {
    console.log(error);
  }
);

// Call this function whenever you want to play the animations
function playBlinkAnimation() {
  if (action && action1) {
    action.reset().play(); // Reset to the beginning and play
    action1.reset().play();
  }
}

document.addEventListener("click", function () {
  playBlinkAnimation();
});

// const eyeShape = new THREE.IcosahedronGeometry(2, 0, 0);
// const altShape = new THREE.ConeGeometry(2, 4, 3);
// const eyeMaterial = new THREE.MeshStandardMaterial({
//   color: "white",
//   transparent: true,
//   opacity: 1.0,
//   wireframe: false,
// });
// const eyeMesh = new THREE.Mesh(eyeShape, eyeMaterial);
// const eyeMesh = new THREE.Mesh(loadedModel);

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

eyeCamera.position.z = 100;
eyeScene.add(eyeCamera);

// light
const eyeLight = new THREE.PointLight(0xffffff, 35);
eyeLight.position.set(0, 0, 10);
const eyeLight2 = new THREE.PointLight(0xffffff, 70);
eyeLight2.position.set(10, 0, 10);
const eyeLight3 = new THREE.PointLight(0xffffff, 70);
eyeLight2.position.set(0, 10, 10);

eyeScene.add(eyeLight);
eyeScene.add(eyeLight2);
eyeScene.add(eyeLight3);

// mouse move anim

window.addEventListener("mousemove", onMouseMove, false);

const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const raycaster = new THREE.Raycaster();
const lidRaycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const lidMouse = new THREE.Vector2();
const intersectPoint = new THREE.Vector3();
const lidIntersectPoint = new THREE.Vector3();
const eyeDiv = document.getElementById("eyebox");
const speed = 150;

function onMouseMove(event) {
  setTimeout(function () {
    if (eyeMesh) {
      const centerPoint =
        eyeDiv.getBoundingClientRect().top + eyeSizes.height / 2;
      const offsetY = centerPoint / sizes.height;

      mouse.x = (event.clientX / sizes.width) * 120 - 60;
      mouse.y = -(event.clientY / sizes.height) * 100 + 100 * offsetY;
      lidMouse.x = (event.clientX / sizes.width) * 50 - 25;
      lidMouse.y = -(event.clientY / sizes.height) * 40 + 40 * offsetY;

      // get the x y coords of the center
      const eyeRect = eyeDiv.getBoundingClientRect();
      const centerX = eyeRect.left + eyeRect.width / 2;
      const centerY = eyeRect.top + eyeRect.height / 2;

      // get the maximum possible distance to each corner
      const distance = Math.sqrt(
        (event.clientX - centerX) ** 2 + (event.clientY - centerY) ** 2
      );
      const distTopLeft = Math.sqrt(centerX ** 2 + centerY ** 2);
      const distTopRight = Math.sqrt(
        (window.innerWidth - centerX) ** 2 + centerY ** 2
      );
      const distBottomLeft = Math.sqrt(
        centerX ** 2 + (window.innerHeight - centerY) ** 2
      );
      const distBottomRight = Math.sqrt(
        (window.innerWidth - centerX) ** 2 + (window.innerHeight - centerY) ** 2
      );
      // returns the greatest number
      const maxDistance = Math.max(
        distTopLeft,
        distTopRight,
        distBottomLeft,
        distBottomRight
      );
      const normalizedDistance = distance / maxDistance;
      // linear interpolation between 50 and 120
      const intersectZAdjusted =
        35 * (1 - normalizedDistance) + 150 * normalizedDistance;

      raycaster.setFromCamera(mouse, eyeCamera);
      lidRaycaster.setFromCamera(lidMouse, eyeCamera);
      raycaster.ray.intersectPlane(plane, intersectPoint);
      lidRaycaster.ray.intersectPlane(plane, lidIntersectPoint);
      intersectPoint.z = intersectZAdjusted;
      lidIntersectPoint.z = intersectZAdjusted;

      const startQuaternion = eyeMesh.quaternion.clone();
      const lStartQuaternion = lidMesh.quaternion.clone();

      eyeMesh.lookAt(intersectPoint);
      lidMesh.lookAt(lidIntersectPoint);

      const endQuaternion = eyeMesh.quaternion.clone();
      const lEndQuaternion = lidMesh.quaternion.clone();

      eyeMesh.quaternion.copy(startQuaternion);
      lidMesh.quaternion.copy(lStartQuaternion);

      const eyeTween = new TWEEN.Tween(eyeMesh.quaternion)
        .to(
          {
            x: endQuaternion.x,
            y: endQuaternion.y,
            z: endQuaternion.z,
            w: endQuaternion.w,
          },
          speed
        )
        .easing(TWEEN.Easing.Quadratic.Out);
      const lidTween = new TWEEN.Tween(lidMesh.quaternion)
        .to(
          {
            x: lEndQuaternion.x,
            y: lEndQuaternion.y,
            z: lEndQuaternion.z,
            w: lEndQuaternion.w,
          },
          speed
        )
        .easing(TWEEN.Easing.Quadratic.Out);
      lidTween.start();
      eyeTween.start();
    }
  }, speed);
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

window.addEventListener("colorEvent", (e) => {
  const directive = e.detail.directive;
  colorControl(directive);
});

function colorControl(directive) {
  switch (directive) {
    case "next":
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const nextTheme = themes[currentThemeIndex];
      changeTheme(nextTheme);
      break;
    case "previous":
      currentThemeIndex = Math.max(currentThemeIndex - 1, 0);
      const prevTheme = themes[currentThemeIndex];
      changeTheme(prevTheme);
      break;
    case "rainbow":
      toggleGayMode();
      break;
  }
}

const shadowElements = document.querySelectorAll(
  "#content, #music-container, #page-header, #progress-container"
);
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
            // eyeMesh.geometry = altShape;
            // setTimeout(() => {
            //   eyeMesh.geometry = eyeShape;
            // }, 300);
            // eyeMaterial.color.set("purple");
            break;

          case "portfolio":
            // eyeMaterial.color.set("blue");
            break;

          case "music":
            // eyeMaterial.color.set("yellow");
            break;

          case "gallery":
            // eyeMaterial.color.set("green");
            break;

          case "the-box":
            // eyeMaterial.color.set("orange");
            break;

          case "controls":
            // eyeMaterial.color.set("cyan");
            break;

          default:
          // eyeMaterial.color.set("white");
        }
      });
      // mouseout event, default color
      child.addEventListener("mouseout", function () {
        // const itemID = this.id;
        // eyeMaterial.color.set("white");
      });
    }
  }
  const eyeBox = document.querySelector("#eyebox");
  const eyeRenderer = new THREE.WebGLRenderer({
    canvas: eyeBox,
    alpha: true,
    antialias: true,
  });

  eyeRenderer.setSize(eyeSizes.width, eyeSizes.height);
  eyeRenderer.setPixelRatio(window.devicePixelRatio * 0.2);
  eyeRenderer.render(eyeScene, eyeCamera);

  let eyeClock = new THREE.Clock();
  let eyeDelta = 0;
  let eyeInterval = 1 / 120;

  const eyeLoop = (t) => {
    if (mixer) {
      mixer.update(eyeClock.getDelta());
    }

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
