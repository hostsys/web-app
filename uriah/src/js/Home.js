import html from "../pages/home.html";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { sfx } from "./sfx";
import html2canvas from "html2canvas-pro";

class Home extends HTMLElement {
  static get tagName() {
    return "home-page";
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;
    this.greeting = document.getElementById('greeting')

    const view = document.getElementById("view");
    const anchors = view.querySelectorAll("a");

    for (let anchor of anchors) {
      anchor.addEventListener("mouseenter", () => {
        sfx("enter");
      });
    }

    this.greeting.addEventListener('click', () => {
      this.greeting.innerText = ':]'
      setTimeout(() => {
        this.greeting.innerText = 'hello'
      }, 750)
    })

    const sizes = {
      width: 400,
      height: 400,
    };

    const container = document.getElementById("heart");
    if (!container) {
      console.error('Container with id "heart" not found');
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(0, 15, 50);

    /* const heartShape = new THREE.Shape();
  const x = 0,
    y = 0;
  heartShape.moveTo(x + 5, y + 5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
  heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
  heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
  heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
 */

    const loader = new GLTFLoader();
    let loadedModel;
    loader.load(
      "/models/seren.glb",
      function (gltf) {
        gltf.scene.scale.set(1000, 1000, 1000);
        gltf.scene.castShadow = true;
        scene.add(gltf.scene);
        loadedModel = gltf.scene;
      },
      undefined,
      function (error) {
        console.log(error);
      }
    );

    const light = new THREE.PointLight(0xffffff, 50);
    light.castShadow = true;
    light.shadow.camera.far = 10000;
    light.position.y = 15;
    light.position.z = 20;

    scene.add(light);

    /* const geometry = new THREE.ShapeGeometry(heartShape);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  }) */ // const cube = new THREE.Mesh(geometry, material);
    // cube.rotation.z = 0.5;
    // scene.add(cube);

    container.style.imageRendering = 'pixelated';
    const renderer = new THREE.WebGLRenderer({
      canvas: container,
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    renderer.shadowMapEnabled = true;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio * 0.3);
    // container.appendChild(renderer.domElement);
    // console.log(renderer.domElement);

    let turningLeft = true;
    let delta = 0;
    let interval = 1000 / 120;

    const animate = (timestamp) => {
      if (timestamp - delta > interval) {
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        if (loadedModel) {
          // loadedModel.rotation.x += 0.01;
          loadedModel.rotation.y += turningLeft ? -0.01 : 0.01;
          if (loadedModel.rotation.y <= -1 || loadedModel.rotation.y >= 0.5) {
            turningLeft = !turningLeft;
          }
        }
        renderer.render(scene, camera);
        delta = timestamp;
      }
      requestAnimationFrame(animate);
    };

    animate();

    /* setTimeout(() => {
      const canvas = document.getElementById("canvas");
      const content = document.getElementById("contentBody");

      // Use html2canvas to render the contentBody onto the canvas
      html2canvas(content, {
        useCORS: true,
        backgroundColor: null, // Keeps transparent background
      }).then((renderedCanvas) => {
        const ctx = canvas.getContext("2d");
        canvas.width = renderedCanvas.width;
        canvas.height = renderedCanvas.height;

        // Draw the captured content onto the main canvas
        ctx.drawImage(renderedCanvas, 0, 0);
      });
    }, 1000); */
  }

  disconnectedCallback() { }
}
customElements.define(Home.tagName, Home);
export default Home;
