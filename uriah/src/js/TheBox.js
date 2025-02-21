import { sfx } from "./sfx.js";
import html from "../pages/the-box.html";

class TheBox extends HTMLElement {
  static get tagName() {
    return "the-box";
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;

    this.modal = document.getElementById("box-dialog");
    this.close = document.getElementById("close");
    this.submit = document.getElementById("submit");
    this.sorry = document.getElementById("sorry");
    this.colorLabel = document.getElementById("color-label");

    this.notification = document.getElementById("notification");
    this.notificationText = document.getElementById("notification-text");

    this.view = document.querySelector("#view");
    this.theBox = document.querySelector("#the-box-box");
    this.colorPicker = document.querySelector("#color-picker");

    this.colorPicker.addEventListener("change", (e) => {
      this.modal.showModal();
    });

    this.sorry.addEventListener("click", () => {
      sfx("nav");
    });

    this.close.addEventListener("click", () => {
      sfx("nav");
    });

    this.submit.addEventListener("click", () => {
      this.postBox();
      // sfx("nav");
    });

    document.addEventListener("boxesFetched", () => {
      this.updateColorLabel();
    });

    this.fetchLocationData();
    this.getToken();
    this.getDimensions();
  }

  async postBox() {
    const locationData = await this.fetchLocationData();

    const data = {
      color: this.convertHexToRGB(this.colorPicker.value),
      ip: locationData.ip,
      coords: locationData.coords,
      token: this.getToken(),
      dimensions: this.getDimensions(),
    };
    console.log(data);
    // return;

    const response = await fetch(
      "https://uriah.website/wp-json/hs/v1/send-boxes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseJSON = await response.json();
    console.log(responseJSON);
    if (responseJSON.status == "OK") {
      sfx("click");
      this.theBox.classList.add("spin-on-event");
      this.updateBoxColor(this.colorPicker.value);
      setTimeout(() => {
        this.theBox.classList.remove("spin-on-event");
      }, 1000);
    } else {
      this.notificationText.innerHTML = responseJSON.status;
      this.notification.showModal();
    }
  }

  async fetchLocationData() {
    const ipResponse = await fetch("https://api.ipify.org?format=json");

    const ipData = await ipResponse.json();
    const ip = ipData.ip;

    const ipReplaceElement = document.getElementById("box-body");
    this.replaceInText(ipReplaceElement, "ipAddress", ip);

    const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
    const locationData = await locationResponse.json();
    const locationCity = locationData.city.toLowerCase();

    const locationReplaceElement = document.getElementById("box-body");
    this.replaceInText(locationReplaceElement, "locationData", locationCity);

    const data = {
      ip: ip,
      coords: `${locationData.lat},${locationData.lon}`,
    };

    return data;
  }

  updateBoxColor(colorHex) {
    document.documentElement.style.setProperty(
      "--box-color",
      this.colorPicker.value
    );
    const colorRGB = this.convertHexToRGB(colorHex);
    this.colorLabel.innerHTML =
      document.documentElement.style.getPropertyValue("--box-color");
  }

  updateColorLabel() {
    this.colorLabel.innerHTML =
      document.documentElement.style.getPropertyValue("--box-color");
  }

  convertHexToRGB(color) {
    color = color.replace("#", "");
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    color = `${r} ${g} ${b}`;
    return color;
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

  replaceInText(element, pattern, replacement) {
    for (let node of element.childNodes) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          this.replaceInText(node, pattern, replacement);
          break;
        case Node.TEXT_NODE:
          node.textContent = node.textContent.replace(pattern, replacement);
          break;
        case Node.DOCUMENT_NODE:
          this.replaceInText(node, pattern, replacement);
      }
    }
  }

  getDimensions() {
    const screenWidth =
      Math.round((window.screen.width * (window.devicePixelRatio || 1)) / 10) *
      10;
    const screenHeight =
      Math.round((window.screen.height * (window.devicePixelRatio || 1)) / 10) *
      10;

    const dimensions = screenWidth * screenHeight;
    return dimensions;
  }

  disconnectedCallback() {}
}

customElements.define(TheBox.tagName, TheBox);
export default TheBox;
