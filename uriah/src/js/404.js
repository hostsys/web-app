import { sfx } from "./sfx.js";
import html from "../pages/404.html";

let count = 0;
class Error extends HTMLElement {
  static get tagName() {
    return "error-page";
  }
  constructor() {
    super();
  }

  connectedCallback() {
    count++;
    this.innerHTML = html;
  }

  disconnectedCallback() {}
}
customElements.define(Error.tagName, Error);
export default Error;
