class PageView extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    let html = `
      <p>HELLO THIS IS A TEST</p>
      <nav-menu></nav-menu>
    `;

    if (window.location.pathname === "/controls") {
      html = `<test-component></test-component>`;
      import("./test-component.js").then(() => {
        this.innerHTML = html;
      });
    } else {
      import("./nav-menu.js").then(() => {
        this.innerHTML = html;
      });
    }
  }
}

window.onpopstate = PageView.render();

customElements.define("page-view", PageView);
