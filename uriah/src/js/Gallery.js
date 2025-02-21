import { sfx } from "./sfx.js";
import html from "../pages/gallery.html";

class Gallery extends HTMLElement {
  static get tagName() {
    return "gallery-page";
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;
  }

  disconnectedCallback() {}
}

customElements.define(Gallery.tagName, Gallery);
export default Gallery;
