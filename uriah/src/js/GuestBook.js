import { sfx } from "./sfx.js";
import html from "../pages/guest-book.html";

class GuestBook extends HTMLElement {
  static get tagName() {
    return "guest-book-page";
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;
    this.guests = null
    this.getGuests()

    this.nameInput = document.querySelector('#name')
    this.nameLabel = document.querySelector('#name-label')
    this.messageInput = document.querySelector('#message')
    this.messageLabel = document.querySelector('#message-label')
    this.signBtn = document.querySelector('#sign')

    this.template = this.querySelector("#guest-template");
    this.container = this.querySelector("#guest-container");

    this.notification = document.getElementById("guest-notification");
    this.notificationText = document.getElementById("guest-notification-text");

    this.nameInput.addEventListener('input', this.nameLimit.bind(this))
    this.messageInput.addEventListener('input', this.messageLimit.bind(this))
    this.signBtn.addEventListener('click', this.validateBook.bind(this))
  }

  nameLimit(e) {
    if (e.target.value.length > 16) {
      this.nameInput.classList.add('border-red-400')
      this.nameLabel.innerText = "too long"
    } else {
      this.nameInput.classList.remove('border-red-400')
      this.nameLabel.innerText = ""
    }
  }

  messageLimit(e) {
    if (e.target.value.length > 128) {
      this.messageInput.classList.add('border-red-400')
      this.messageLabel.innerText = "too long"
    } else {
      this.messageInput.classList.remove('border-red-400')
      this.nameLabel.innerText = ""
    }
  }

  validateBook() {
    const nameValue = this.nameInput.value
    const messageValue = this.messageInput.value
    let isValid = true

    if (nameValue.length < 1 || nameValue.length > 16) {
      this.nameLabel.innerText = "invalid name"
      this.nameInput.classList.add('border-red-400')
      isValid = false
      setTimeout(() => {
        this.nameInput.classList.remove('border-red-400')
        this.nameLabel.innerText = ""

      }, 2000)
    }
    if (messageValue.length < 1 || messageValue.length > 128) {
      this.messageLabel.innerText = "invalid message"
      this.messageInput.classList.add('border-red-400')
      isValid = false
      setTimeout(() => {
        this.messageInput.classList.remove('border-red-400')
        this.messageLabel.innerText = ""

      }, 2000)
    }

    if (isValid)
      this.postBook(nameValue, messageValue)

  }

  async postBook(name, message) {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ip = await ipResponse.json().then(data => data.ip)

    const data = {
      name: name,
      message: message,
      token: this.getToken(),
      ip: ip
    };
    // return;

    const guestResponse = await fetch(
      "https://uriah.website/wp-json/hs/v1/send-guestbook-entry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const guestJson = await guestResponse.json()

    if (guestJson.status === "OK") {
      this.getGuests()
      this.nameInput.value = null
      this.messageInput.value = null
    } else {
      this.notificationText.innerHTML = guestJson.status
      this.notification.showModal();
    }
  }

  getToken() {
    let token = "";
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const n = 12;
    for (var i = 0; i < n; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }

    if (localStorage.getItem("token") == null) {
      localStorage.setItem("token", token);
      return token;
    } else {
      return localStorage.getItem("token");
    }
  }

  reRenderGuests(guests) {
    guests.forEach((guest) => {
      const fragment = this.template.content.cloneNode(true);
      const guestDiv = fragment.firstElementChild

      const name = guestDiv.querySelector("#guest-name");
      name.textContent = guest.name;
      if (guest.name === 'uriah')
        name.classList.add('text-orange-400')

      const message = guestDiv.querySelector("#guest-message");
      message.textContent = guest.message;

      const date = guestDiv.querySelector("#guest-date");
      const guestDate = new Date(guest.date + ' UTC')
      date.textContent = guestDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
      }) + ' ' + guestDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      guestDiv.classList.add('new-guest', 'duration-500', 'ease-out', 'opacity-0', 'transition-all')
      this.container.prepend(guestDiv);

    });
    const newDivs = document.querySelectorAll('.new-guest')
    setTimeout(() => {
      newDivs.forEach((div) => {
        div.classList.add('opacity-100')
        div.classList.remove('duration-500', 'ease-out', 'new-guest')

      })
    }, 300)
  }

  renderGuests(guests) {
    this.container.innerHTML = "";
    guests.forEach((guest) => {
      const guestDiv = this.template.content.cloneNode(true);

      const name = guestDiv.querySelector("#guest-name");
      name.textContent = guest.name;
      if (guest.name === 'uriah')
        name.classList.add('text-orange-400')

      const message = guestDiv.querySelector("#guest-message");
      message.textContent = guest.message;

      const date = guestDiv.querySelector("#guest-date");
      const guestDate = new Date(guest.date + ' UTC')
      date.textContent = guestDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
      }) + ' ' + guestDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      this.container.appendChild(guestDiv);
    });
  }

  async getGuests() {
    if (this.guests?.length) {
      const oldGuests = this.guests
      const allGuests = await fetch("https://uriah.website/wp-json/hs/v1/guests").then((response) => response.json());
      const newGuests = allGuests.filter((guest) => {
        return !oldGuests.some(oldGuest => oldGuest.name === guest.name)
      })
      this.reRenderGuests(newGuests)
    } else {

      const guests = await fetch("https://uriah.website/wp-json/hs/v1/guests").then((response) => response.json());
      this.guests = guests
      this.renderGuests(guests)
    }

  }

  disconnectedCallback() { }
}

customElements.define(GuestBook.tagName, GuestBook);
export default GuestBook;
