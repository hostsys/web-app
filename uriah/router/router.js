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

    window.addEventListener('navigate', (e) => {
      console.log(e)
      const route = e.detail.route
      this.handleRoute(route)
    })
  }

  handleRoute(route) {
    if (route.length === 0) route = "/";
    if (route.length > 1 && route.endsWith('/'))
      route = route.slice(0, -1)
    if (this.routes[route]) {
      this.loadComponent(route);
      return
    }
    const segments = route.split('/').filter(Boolean)
    const potentialDynamicRoutes = Object.keys(this.routes).filter(route => route.includes(':'))
    let match

    potentialDynamicRoutes.forEach((dynamicRoute) => {
      const dynamicSegments = dynamicRoute.split('/').filter(Boolean)

      if (dynamicSegments.length === segments.length && dynamicSegments[0] === segments[0]) {
        match = true
        const args = segments[1]

        this.loadComponent(dynamicRoute, args)
        return
      }
    })

    if (!match)
      this.loadComponent("404");
  }

  async loadComponent(route, args = null) {
    window.dispatchEvent(new CustomEvent("navEvent"));
    const view = document.getElementById("view");
    const { default: Component } = await this.routes[route].component();

    document.title = route === 'read-writes/:id' && args ? `uriah's post #${args}` : `uriah's ${this.routes[route].title}`;

    const component = document.createElement(Component.tagName);
    component.args = args

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
  "/music/:id": {
    component: () => import("../src/js/Music"),
    title: "post",
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
  "/read-writes": {
    component: () => import("../src/js/ReadWrites"),
    title: "read-writes",
  },
  "/read-writes/:id": {
    component: () => import("../src/js/Read"),
    title: "post",
  },
  "/secret": {
    component: () => import("../src/js/Secret"),
    title: "secret",
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
