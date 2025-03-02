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

      const href = target.getAttribute("href");
      const isExternalLink = href.startsWith("http://") ||
        href.startsWith("https://")

      if (isExternalLink) {
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
    const { default: Component } = await this.routes[route].component();
    document.title = "uriah's " + this.routes[route].title;
    const component = document.createElement(Component.tagName);

    view.classList.add("opacity-0", "translate-y-[100px]");
    setTimeout(() => {
      view.classList.remove("opacity-0", "translate-y-[100px]");
      view.innerHTML = "";
      view.appendChild(component);
    }, 150);
  }
}

const routes = {
  "/": {
    component: () => import("../src/js/Home"),
    title: "home",
  },
  "/portfolio": {
    component: () => import("../src/js/Portfolio"),
    title: "portfolio",
  },
  "/controls": {
    component: () => import("../src/js/Controls"),
    title: "controls",
  },
  "/music": {
    component: () => import("../src/js/Music"),
    title: "music",
  },
  "/gallery": {
    component: () => import("../src/js/Gallery"),
    title: "gallery",
  },
  "/the-box": {
    component: () => import("../src/js/TheBox"),
    title: "box",
  },
  "/guest-book": {
    component: () => import("../src/js/GuestBook"),
    title: "guest-book",
  },
  // "/template": {
  //   component: () => import("../src/js/componentTemplate"),
  //   title: "component template",
  // },
  404: {
    component: () => import("../src/js/404"),
    title: "404",
  },
};

const router = new Router(routes);
