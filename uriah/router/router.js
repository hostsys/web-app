document.addEventListener("click", (e) => {
  const { target } = e;
  if (!target.matches("a")) {
    return;
  }
  e.preventDefault();
  urlRoute();
});

const urlRoutes = {
  404: {
    template: "/src/pages/404.html",
    title: "404",
    description: "",
  },
  "/": {
    template: "/src/pages/home.html",
    title: "/home",
    description: "",
  },
  "/portfolio": {
    template: "/src/pages/portfolio.html",
    title: "/portfolio",
    description: "",
  },
  "/controls": {
    template: "/src/pages/controls.html",
    title: "/controls",
    description: "",
  },
  "/music": {
    template: "/src/pages/music.html",
    title: "/music",
    description: "",
  },
  "/gallery": {
    template: "/src/pages/gallery.html",
    title: "/gallery",
    description: "",
  },
  "/the-box": {
    template: "/src/pages/the-box.html",
    title: "/the-box",
    description: "",
  },
};

const navEvent = new CustomEvent("navEvent");

const urlRoute = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  window.dispatchEvent(navEvent);
  urlLocationHandler();
};

const loadedScripts = new Set();
const urlLocationHandler = async () => {
  let location = window.location.pathname;
  if (location.length == 0) {
    location = "/";
  }

  const route = urlRoutes[location] || urlRoutes[404];
  const html = await fetch(route.template).then((response) => response.text());

  document.getElementById("view").innerHTML = html;
  document.getElementById("page-header").innerHTML = route.title;

  const existingScripts = document.querySelectorAll("script[dynamic-src]");
  existingScripts.forEach((script) => {
    script.parentNode.removeChild(script);
  });

  const scriptTags = new DOMParser()
    .parseFromString(html, "text/html")
    .querySelectorAll("script");

  scriptTags.forEach((scriptTag) => {
    // console.log(scriptTag);
    const scriptContent = scriptTag.innerHTML;

    // const scriptPath = scriptTag.getAttribute("dynamic-src");

    // console.log("script path: ", scriptPath);
    // console.log("scripts before creation: ", loadedScripts);
    if (scriptTag.getAttribute("src") !== "/@vite/client") {
      // console.log("loaded script for this path not found, creating!");
      const script = document.createElement("script");
      script.textContent = scriptContent;
      script.setAttribute("type", "module");
      script.setAttribute("dynamic-src", location);
      document.head.appendChild(script);
      // loadedScripts.add(location);
      // console.log("scripts after creation: ", loadedScripts);
      // console.log(scriptTags);
    } // else {
    // console.log("loaded script for this path found, NOT creating new one");
    // }
  });
};

if (import.meta.hot) {
  import.meta.hot.accept(async (newModule) => {
    // This code will run when Vite detects changes and triggers a hot update

    // Fetch the updated HTML content and update the DOM
    await urlLocationHandler();
  });
}

window.onpopstate = urlLocationHandler();
window.route = urlRoute;
// urlLocationHandler();
