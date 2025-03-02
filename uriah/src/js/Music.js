import { sfx } from "./sfx.js";
import html from "../pages/music.html";

class Music extends HTMLElement {
  static get tagName() {
    return "music-page";
  }

  constructor() {
    super();
    this.currentSong = null;
    this.songStatus = null;
  }

  connectedCallback() {
    this.innerHTML = html;

    this.songs = null
    this.songs = JSON.parse(sessionStorage.getItem("songs"));
    window.addEventListener("newSong", (event) =>
      this.handleNewSong(event.detail.id, event.detail.status)
    );
    this.getSongs()

  }

  getSongs() {
    this.songs = JSON.parse(sessionStorage.getItem("songs"));
    if (!this.songs) {
      setTimeout(() => {
        this.getSongs()
      }, 250)
    } else {
      this.renderSongs();
    }
  }

  renderSongs() {
    const template = this.querySelector("#song-template");
    const container = this.querySelector("#music-container");
    container.innerHTML = "";
    this.songs.forEach((song) => {
      const songDiv = template.content.cloneNode(true);
      const isCurrentSong = song.id === this.currentSong;

      const img = songDiv.querySelector("#cover-art");
      img.src = song.coverArt;

      const title = songDiv.querySelector("#title");
      title.textContent = song.title;

      const icon = songDiv.querySelector("#playing-icon");
      if (isCurrentSong) {
        icon.classList.remove("hidden");
        if (this.songStatus === "playing") icon.classList.add("rotate");
      }

      const button = songDiv.querySelector("#play-pause");
      button.addEventListener("click", () => {
        sfx("short");
        this.changeSong(song.id);
      });

      const spotify = songDiv.querySelector("#external");
      spotify.href = song.spotifyLink;

      const liner = songDiv.querySelector("#one-liner");
      liner.textContent = song.oneLiner;

      const releaseDate = songDiv.querySelector("#date");
      releaseDate.textContent = song.releaseDate;

      container.appendChild(songDiv);
    });
  }

  changeSong(id) {
    const changeSongEvent = new CustomEvent("changeSong", {
      detail: { id },
    });
    window.dispatchEvent(changeSongEvent);
  }

  handleNewSong(id, status) {
    this.currentSong = id;
    this.songStatus = status;
    this.renderSongs();
  }

  disconnectedCallback() {
    window.removeEventListener("newSong", this.handleNewSong);
  }
}

customElements.define(Music.tagName, Music);
export default Music;
