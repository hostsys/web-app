import { sfx } from "./sfx.js";
import html from "../pages/html.html";

class Component extends HTMLElement {
  static get tagName() {
    return "tag-name";
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;
  }

  disconnectedCallback() {}
}

customElements.define(Component.tagName, Component);
export default Component;
