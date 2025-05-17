import html from "../pages/secret.html";

class Secret extends HTMLElement {
  static get tagName() {
    return "secret-page";
  }

  constructor() {
    super();
  }


  connectedCallback() {
    this.innerHTML = html;
    this.scrollEvent = new CustomEvent('scroll');

    this.input = this.querySelector('#password')
    this.notification = this.querySelector('#password-notif')
    this.notificationText = this.querySelector('#password-notif-text')
    const form = this.querySelector('#password-form')
    form.addEventListener('submit', (e) => this.submitPass(e))
  }

  async submitPass(e) {
    e.preventDefault()

    const data = {
      password: this.input.value || null,
    };

    const passResponse = await fetch(
      "https://uriah.website/wp-json/hs/v1/send-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const passJson = await passResponse.json()

    if (passJson.status === 'OK') {
      const titleBar = this.querySelector('#title-bar');
      const title = this.querySelector('#secret-title');
      const date = this.querySelector('#secret-date');
      const content = this.querySelector('#secret-content');

      titleBar.classList.remove('opacity-0');
      content.innerHTML = passJson.content;
      title.textContent = passJson.title;
      date.textContent = passJson.date;
      window.dispatchEvent(this.scrollEvent)

    } else {
      this.notificationText.innerText = passJson.status;
      this.notification.showModal();
    }
  }


  disconnectedCallback() { }
}

customElements.define(Secret.tagName, Secret);
export default Secret;
