class PageHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = html;
    this.routeBox = document.getElementById('page-header')
  }

  connectedCallback() {
    this.updateBox();
    window.addEventListener("popstate", () => {
      this.updateBox();
    });
    window.addEventListener("navEvent", () => {
      this.updateBox();
    });
    this.routeBox.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location)
      this.routeBox.innerText = 'copied'
      setTimeout(() => {
        this.updateBox()

      }, 750)
    })
  }

  updateBox() {
    this.routeBox.innerText = window.location.pathname;
  }
}

const html = `
      <div
        id="page-header"
        class="cursor-active crtext fixed left-8 top-2 transition-colors rounded-sm border-4 text-primary border-primary border-opacity-80 bg-scene px-2 group-hover:border-opacity-100 md:left-10"
      >
      </div>
`;

customElements.define("page-header", PageHeader);
