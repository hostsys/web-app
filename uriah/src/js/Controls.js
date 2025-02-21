import { sfx } from "./sfx.js";
import html from "../pages/controls.html";

class Controls extends HTMLElement {
  static get tagName() {
    return "controls-page";
  }
  constructor() {
    super();
    this.keyActions = {
      w: "faster",
      a: "left",
      s: "slower",
      d: "right",
      q: "color-previous",
      e: "color-next",
      r: "color-rainbow",
    };
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
    this.dynamicClasses = ["scale-95", "!bg-primary/10"];
  }

  connectedCallback() {
    this.innerHTML = html;
    const createControlEvent = (directive) =>
      new CustomEvent("controlEvent", { detail: { directive } });
    const createColorEvent = (directive) =>
      new CustomEvent("colorEvent", { detail: { directive } });

    const classList = ["bg-primary/10"];

    const events = {
      fasterStart: createControlEvent("faster"),
      stop: createControlEvent("stop"),
      slowerStart: createControlEvent("slower"),
      leftStart: createControlEvent("left"),
      rightStart: createControlEvent("right"),
      stopR: createControlEvent("stopR"),
      nextColor: createColorEvent("next"),
      previousColor: createColorEvent("previous"),
      rainbow: createColorEvent("rainbow"),
    };

    const buttons = [
      { id: "faster", startEvent: events.fasterStart, endEvent: events.stop },
      { id: "slower", startEvent: events.slowerStart, endEvent: events.stop },
      { id: "left", startEvent: events.leftStart, endEvent: events.stopR },
      { id: "right", startEvent: events.rightStart, endEvent: events.stopR },
      { id: "color-next", startEvent: events.nextColor, endEvent: null },
      {
        id: "color-previous",
        startEvent: events.previousColor,
        endEvent: null,
      },
      { id: "color-rainbow", startEvent: events.rainbow, endEvent: null },
    ];

    buttons.forEach(({ id, startEvent, endEvent }) => {
      const button = document.getElementById(id);
      button.addEventListener("touchstart", () => {
        this.setColor(id);
        window.dispatchEvent(startEvent);
      });
      button.addEventListener("touchend", () => {
        this.removeColor(id);
        endEvent ? window.dispatchEvent(endEvent) : null;
      });
    });

    document.addEventListener("keydown", this.handleKeyEvent);
    document.addEventListener("keyup", this.handleKeyEvent);
  }
  setColor(button) {
    document.getElementById(button).classList.add(...this.dynamicClasses);
  }

  removeColor(button) {
    document.getElementById(button).classList.remove(...this.dynamicClasses);
  }

  handleKeyEvent(e) {
    const action = this.keyActions[e.key];
    if (action) {
      if (e.type === "keydown") {
        this.setColor(action);
      } else if (e.type === "keyup") {
        this.removeColor(action);
      }
    }
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.handleKeyEvent);
    document.removeEventListener("keyup", this.handleKeyEvent);
  }
}

customElements.define(Controls.tagName, Controls);
export default Controls;
