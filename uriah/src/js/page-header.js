class PageHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = html;
  }

  connectedCallback() {
    this.updateBox();
    window.addEventListener("popstate", () => {
      this.updateBox();
    });
    window.addEventListener("navEvent", () => {
      this.updateBox();
    });
  }

  updateBox() {
    const routeBox = document.getElementById("page-header");
    routeBox.innerHTML = window.location.pathname;
  }
}

const html = `
      <div
        id="page-header"
        class="fixed left-8 top-2 transition-colors rounded-sm border-4 text-primary border-primary border-opacity-80 bg-scene px-2 group-hover:border-opacity-100 md:left-10"
      >
      </div>
`;

customElements.define("page-header", PageHeader);
