import { sfx } from "./sfx.js";
import html from "../pages/portfolio.html";

class Portfolio extends HTMLElement {
  static get tagName() {
    return "portfolio-page";
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;

    const button = this.querySelector("#crash");

    const body = document.querySelector("#contentBody");
    const elements = body.querySelectorAll("*");
    function freezeSite(duration) {
      const start = Date.now();
      while (Date.now() - start < duration) {}
    }

    button.addEventListener("click", () => {
      freezeSite(3000);
      const rainbowEvent = new CustomEvent("colorEvent", {
        detail: { directive: "rainbow" },
      });
      window.dispatchEvent(rainbowEvent);
      const interval = setInterval(() => {
        elements.forEach((element) => {
          if (element.id === "bg") return;

          const random1 = this.randomInt(-50, 50);
          const random2 = this.randomInt(-50, 50);
          const scale = this.randomInt(0.8, 1);
          const rotation = this.randomInt(3, 5);
          const leftRight = this.randomInt(0, 1);

          // Combine all transform properties
          let transform = `translate(${random1}px, ${random2}px) scale(${scale})`;
          // let transform = `scale(${scale})`;

          if (leftRight > 0.5) {
            transform += ` rotate(${rotation}deg)`;
          } else {
            transform += ` rotate(-${rotation}deg)`;
          }

          element.style.transform = transform;
        });
      }, 361); // Loop every 500ms (0.5 seconds)
      setTimeout(() => {
        while (true) {
          for (let i = 99; i === i; i *= i) {
            console.log(i);
          }
        }
        console.log("BANG, you're dead");
      }, 3000);
    });
  }

  randomInt(min, max) {
    return Math.random() * (max - min) + min;
  }

  disconnectedCallback() {}
}

customElements.define(Portfolio.tagName, Portfolio);
export default Portfolio;
