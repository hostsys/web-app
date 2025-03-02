import { sfx } from "./sfx.js";
import html from "../pages/portfolio.html";

class Portfolio extends HTMLElement {
  static get tagName() {
    return "portfolio-page";
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;

    this.iframes = new Map()
    this.urlMap = {
      'lmb': 'https://leeannmariebeauty.com',
      'russo': 'https://www.russocorp.com',
      'cloud': 'https://www.cloudtechinc.com',
      'mojo': 'https://www.mojojoint.com',
      'imperial': 'https://www.imperialrefresh.com'
    }
    this.buttons = document.querySelectorAll('button[id^="load-"]')
    this.iframeEvent = new CustomEvent('iframe');

    this.init()
  }

  init() {
    this.buttons.forEach(button => {
      const siteKey = button.id.replace('load-', '')

      this.iframes.set(siteKey, {
        loaded: false,
        button: button,
        container: button.closest('div'),
        url: this.urlMap[siteKey]
      })
      button.addEventListener('click', () => this.loadIframe(siteKey))
    })
  }

  loadIframe(siteKey) {
    const site = this.iframes.get(siteKey)
    if (site.loaded) {
      this.toggleIframe(siteKey)
      return
    }

    const iframe = document.createElement('iframe')
    iframe.classList.add('!h-[600px]')
    site.container.classList.add('!h-[600px]')
    iframe.src = site.url
    site.container.innerHTML = ''
    site.container.appendChild(iframe)

    site.button = document.createElement('button');
    site.button.classList.add('crtext', 'underline', 'top-2', 'right-2', 'z-[800]', 'bg-scene', 'bg-opacity-20', 'px-2', 'py-1');
    site.button.textContent = `close ${siteKey} preview`;
    site.button.addEventListener('click', () => this.toggleIframe(siteKey));
    site.container.prepend(site.button);

    site.loaded = true
    site.iframe = iframe
    this.scrollTo(siteKey)
    window.dispatchEvent(this.iframeEvent)

  }

  scrollTo(siteKey) {
    const site = this.iframes.get(siteKey)
    const view = document.getElementById('view')

    view.scrollTo({ top: site.container.offsetTop - view.offsetTop })

  }

  toggleIframe(siteKey) {
    const site = this.iframes.get(siteKey)

    if (!site.loaded)
      return
    if (site.iframe.style.display === 'none') {
      site.iframe.style.display = ''
      site.container.classList.add('!h-[600px]')
      site.button.textContent = `close ${siteKey} preview`
      this.scrollTo(siteKey)
    } else {
      site.iframe.style.display = "none"
      site.container.classList.remove('!h-[600px]')
      site.button.textContent = `re-open ${siteKey} preview`
    }
    window.dispatchEvent(this.iframeEvent)

  }

  disconnectedCallback() { }
}

customElements.define(Portfolio.tagName, Portfolio);
export default Portfolio;
