class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  init() {
    this.handleRoute(window.location.pathname);
    window.onpopstate = () => this.handleRoute(window.location.pathname);

    document.addEventListener("click", (e) => {
      const { target } = e;
      if (!target.matches("a")) {
        return;
      }
      e.preventDefault();
      history.pushState({}, "", e.target.href);
      this.handleRoute(window.location.pathname);
    });
  }

  handleRoute(route) {
    if (route.length === 0) route = "/";
    if (this.routes[route]) {
      this.loadComponent(route);
    } else {
      this.loadComponent("404");
    }
  }

  async loadComponent(route) {
    window.dispatchEvent(new CustomEvent("navEvent"));
    const view = document.getElementById("view");
    view.innerHTML = "";

    const { default: Component } = await this.routes[route].component();
    const component = document.createElement(Component.tagName);
    view.appendChild(component);
  }
}

const routes = {
  "/": {
    component: () => import("../src/js/HomeComponent"),
    title: "Home",
  },
  "/two": {
    component: () => import("../src/js/pageTwoComponent"),
    title: "Page Two",
  },
  404: {
    component: () => import("../src/js/404"),
    title: "Page Two",
  },
};

const router = new Router(routes);
