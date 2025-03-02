import axios from "axios";
import { sfx } from "./sfx.js";

const html = `
  <!-- music player -->
 <div
        id="music-container"
        class="group/container flex max-h-24 rounded-sm border-4 border-primary border-opacity-80 duration-300 hover:border-opacity-100 md:max-h-32"
    >
        <div
            id="img-container"
            class="group/tooltip relative flex w-20 flex-shrink-0 p-1 pb-2 md:h-full md:w-28 md:pb-1"
        >
            <img
                src="https://media.tenor.com/kxefu8OQcD8AAAAC/loli-anime.gif"
                id="cover"
                class="cursor-active active:cursor-stabbing"
            />
            <img
                id="cover-tooltip"
                src="https://media.tenor.com/kxefu8OQcD8AAAAC/loli-anime.gif"
                class="absolute left-[calc(50%-2px)] z-10 hidden h-full rounded-sm border-[0.5px] border-primary group-hover/tooltip:top-[-160%] group-hover/tooltip:block group-hover/tooltip:scale-[200%]"
            /> 
        </div>
        <div id="music-container-inner" class="grid w-full grid-flow-col max-md:grid-cols-6 grid-cols-7 grid-rows-3">
            <div
                id="volume-container"
                class="no-select col-span-1 max-md:hidden row-span-1 flex w-full cursor-active border-b-4 border-l-4 border-primary border-opacity-80 p-1 text-sm text-secondary transition-colors duration-300 active:cursor-stabbing group-hover/container:border-opacity-100"
            >
                <button
                    id="volume-0"
                    class="vol-btn transition-colors flex w-1/5 items-center justify-center bg-primary"
                >
                    <p class="crtext decoration-secondary decoration-double decoration-2 underline-offset-2" >0</p>
                </button>
                <button
                    id="volume-25"
                    class="vol-btn transition-colors flex w-1/5 items-center justify-center bg-primary"
                >
                    <p class="crtext decoration-secondary decoration-double decoration-2 underline-offset-2" >25</p>
                </button>
                <button
                    id="volume-50"
                    class="vol-btn transition-colors flex w-1/5 items-center justify-center bg-primary"
                >
                    <p
                        class="crtext decoration-secondary decoration-double decoration-2 underline-offset-2"
                    >
                        50
                    </p>
                </button>
                <button
                    id="volume-75"
                    class="vol-btn transition-colors flex w-1/5 items-center justify-center border-secondary bg-primary"
                >
                    <p class="crtext decoration-secondary decoration-double decoration-2 underline-offset-2" >75</p>
                </button>
                <button
                    id="volume-100"
                    class="vol-btn transition-colors flex w-1/5 items-center justify-center border-secondary bg-primary"
                >
                    <p class="crtext decoration-secondary decoration-double decoration-2 underline-offset-2" >100</p>
                </button>
            </div>
            <div id="music-info" class="col-span-1 max-md:hidden row-span-2 flex flex-col justify-center pl-1">
                <div id="title" ref="title" class="md:text-md text-nowrap text-sm">
                    {{ songsList[index].title }}
                </div>
                <a id="external-link" target="_blank" rel="noopener noreferrer" class="crtext invisible text-sm underline md:visible">external link</a>
            </div>
            <div
                id="music-progress"
                class="col-span-6 row-span-1 flex cursor-active active:cursor-stabbing"
            >
                <div
                    @mouseup="progressActive"
                    id="progress-container"
                    class="w-full relative border-b-4 border-l-4 border-primary border-opacity-80 p-1 duration-300 group-hover/container:border-opacity-100"
                ><p id="mobile-title" class="absolute md:hidden top-0.5 left-1.5 text-sm text-scene w-full text-center">awaiting title</p>
                    <div
                        id="progress"
                        class="h-full w-0 bg-primary bg-fixed transition-all duration-150 ease-in"
                    >
                        <div
                            class="h-full bg-gradient-to-r from-transparent from-20% to-secondary bg-fixed"
                        ></div>
                    </div>
                </div>
            </div>
            <div id="navigation" class="col-span-6 row-span-2 flex gap-0 justify-center">
                <button @click="changeSong(-1)" id="prev">
                    <div class="backward-icon opacity-80 min-h-[33px] w-[64px] transition-all duration-300 group-hover/container:opacity-100">  </div>
                </button>
                <button id="play-pause" @click="playPause()" class="cursor-pointer pb-0">
                    <div class="pop play-icon opacity-80 min-h-[33px] w-[64px] transition-all duration-300 group-hover/container:opacity-100">  </div>
                    <div class="pop hidden pause-icon opacity-80 min-h-[33px] w-[64px] transition-all duration-300 group-hover/container:opacity-100">  </div>
                </button>
                <button @click="changeSong(1)" id="next">
                    <div class="pop forward-icon opacity-80 min-h-[33px] w-[64px] transition-all duration-300 group-hover/container:opacity-100">  </div>
                </button>
            </div>
        </div>
    </div>
`;

class MusicPlayer extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = html;
  }
}

customElements.define("music-player", MusicPlayer);

// music player

class Song {
  constructor(
    id,
    title,
    coverArt,
    musicFile,
    releaseDate,
    spotifyLink,
    oneLiner,
    order
  ) {
    this.id = id;
    this.title = title;
    this.coverArt = coverArt;
    this.musicFile = new Audio(musicFile);
    this.releaseDate = releaseDate;
    this.spotifyLink = spotifyLink;
    this.oneLiner = oneLiner;
    this.order = order;
    this.isPlaying = false;
  }

  play() {
    this.musicFile.play();
    this.isPlaying = true;
  }

  pause() {
    this.musicFile.pause();
    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

let songs = [];

// setInterval(getMusic, 5000);

let currentSongIndex = 0;
let currentSong = songs[currentSongIndex];
let currentVolume = Math.pow(0.5, 1.5);

let isDragging = false;

const playBtn = document.getElementById("play-pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const progressBar = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");

const playIcon = document.querySelector(".play-icon");
const pauseIcon = document.querySelector(".pause-icon");

const titleElement = document.getElementById("title");
const linkElement = document.getElementById("external-link")
const mobileTitle = document.getElementById("mobile-title");
const coverElements = document.querySelectorAll("#cover, #cover-tooltip");

const eventElements = document.querySelectorAll(
  "a, button, router-link, input, #cover, .vol-btn, #progress-container"
);

const getMusic = async () => {
  try {
    const response = await axios.get(
      "https://uriah.website/wp-json/hs/v1/musics"
    );
    const musicData = response.data;

    songs = musicData.map(
      (songData) =>
        new Song(
          songData.id,
          songData.title,
          songData.cover_art,
          songData.music_file,
          songData.release_date,
          songData.spotify_link,
          songData.one_liner,
          songData.order
        )
    );
    const firstSongIndex = songs.findIndex((song) => song.order === 1);

    if (firstSongIndex !== -1) {
      const savedSong = JSON.parse(sessionStorage.getItem("savedSong"));
      const [desiredSong] = songs.splice(firstSongIndex, 1);
      songs.unshift(desiredSong);
      if (savedSong)
        currentSongIndex = songs.findIndex((song) => song.id === savedSong);
    }

    sessionStorage.setItem("songs", JSON.stringify(songs));
    // console.log(songs)
    loadSong();
  } catch (err) {
    console.log(err);
  }
};
getMusic();

playBtn.onclick = () => {
  playPauseSong();
  sfx("short");
};
prevBtn.onclick = () => {
  changeSong(-1);
  sfx("short");
};
nextBtn.onclick = () => {
  changeSong(1);
  sfx("short");
};

document.addEventListener("keypress", (e) => {
  if (e.key === " ") {
    const focusedElement = document.activeElement;
    if (
      focusedElement.id !== "play-pause" &&
      focusedElement.id !== "prev" &&
      focusedElement.id !== "next"
    )
      playPauseSong();
  }
});

progressContainer.addEventListener("mousedown", startDragging);
window.addEventListener("mousemove", updateDragging);
window.addEventListener("mouseup", endDragging);
window.addEventListener("changeSong", (e) => {
  if (songs[currentSongIndex].id === e.detail.id) {
    playPauseSong();
  } else {
    changeSong(false, e.detail.id);
  }
});

const volumeButtons = document.querySelectorAll(".vol-btn");

volumeButtons.forEach((item) => {
  item.addEventListener("click", () => {
    sfx("short");
    const button = item.id;
    const btnTexts = document.querySelectorAll(".vol-btn p");
    let volume = null;

    // Remove styles from all p elements
    btnTexts.forEach((p) => {
      p.classList.remove("underline");
    });

    switch (button) {
      case "volume-0":
        volume = 0;
        break;
      case "volume-25":
        volume = 0.25;
        break;
      case "volume-50":
        volume = 0.5;
        break;
      case "volume-75":
        volume = 0.75;
        break;
      case "volume-100":
        volume = 1;
        break;
    }
    setVolume(volume);
  });
});

function setVolume(volume) {
  localStorage.setItem("volume", volume);
  currentSong.musicFile.volume = volume;

  setVolumeButton(volume);
}

function setVolumeButton(volume) {
  const buttonId = `volume-${volume * 100}`;
  const button = document.getElementById(buttonId);

  const paragraph = button.querySelector("p");
  paragraph.classList.add("underline");
}

// function interpolateColor(primary, scene, percentage) {
//   const [r1, g1, b1] = primary.split(" ").map(Number);
//   const [r2, g2, b2] = scene.split(" ").map(Number);

//   const r = Math.round(r2 + r1 * (percentage / 100));
//   const g = Math.round(g2 + g1 * (percentage / 100));
//   const b = Math.round(b2 + b1 * (percentage / 100));

//   return `rgb(${r} ${g} ${b})`;
// }

// function updateVolumeButtonColors() {
//   const primaryColor = getComputedStyle(
//     document.documentElement
//   ).getPropertyValue("--color-primary");
//   const sceneColor = getComputedStyle(
//     document.documentElement
//   ).getPropertyValue("--color-scene");

//   document.querySelectorAll(".vol-btn").forEach((button, index) => {
//     const percentage = index * 17.5 + 30;
//     const backgroundColor = interpolateColor(
//       primaryColor,
//       sceneColor,
//       percentage
//     );
//     button.style.backgroundColor = backgroundColor;
//   });
// }

// updateVolumeButtonColors();

function updateProgress() {
  const { currentTime, duration } = currentSong.musicFile;
  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercent}%`;

  if (progressPercent === 100) {
    setTimeout(changeSong(1), 250);
  }
}

let downTime;
let upTime;
let deltaTime;

function startDragging(e) {
  isDragging = true;
  downTime = new Date();
  //   navSfx.cloneAndPlay();
  sfx("short");

  eventElements.forEach((e) => {
    e.style.pointerEvents = "none";
  });
  currentSong = songs[currentSongIndex];
  currentSong.pause();

  document.body.classList.add("no-select");

  playIcon.classList.remove("hidden");
  pauseIcon.classList.add("hidden");

  updateDragging(e);
}

function updateDragging(e) {
  if (!isDragging) return;

  const width = progressContainer.clientWidth;
  const clickX = e.clientX - progressContainer.getBoundingClientRect().left;
  const duration = currentSong.musicFile.duration;

  currentSong.musicFile.currentTime = (clickX / width) * duration;
}

window.addEventListener("navEvent", () => {
  if (window.location.pathname === "/music") {
    setTimeout(() => {
      playPauseSong();
      playPauseSong();
    }, 200);
  }
});

function endDragging() {
  if (isDragging) {
    isDragging = false;
    upTime = new Date();
    deltaTime = upTime - downTime;
    // console.log(deltaTime);
    if (deltaTime > 200) sfx("short");

    eventElements.forEach((e) => {
      e.style.pointerEvents = "auto";
    });
    document.body.classList.remove("no-select");
    playPauseSong();
  }
}

function playPauseSong() {
  currentSong = songs[currentSongIndex];
  if (currentSong.isPlaying) {
    currentSong.pause();
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    const newSongEvent = new CustomEvent("newSong", {
      detail: {
        id: songs[currentSongIndex].id,
        status: "paused",
      },
    });
    window.dispatchEvent(newSongEvent);
  } else {
    currentSong.play();
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");
    const newSongEvent = new CustomEvent("newSong", {
      detail: {
        id: songs[currentSongIndex].id,
        status: "playing",
      },
    });
    window.dispatchEvent(newSongEvent);
  }
}

function changeSong(delta, specific) {
  currentSong.musicFile.removeEventListener("timeupdate", updateProgress);
  currentSong.pause();
  if (specific) {
    currentSongIndex = songs.indexOf(
      songs.find((song) => song.id === specific)
    );
  } else {
    currentSongIndex = (currentSongIndex + delta + songs.length) % songs.length;
  }
  sessionStorage.setItem("savedSong", songs[currentSongIndex].id);
  loadSong();
  playPauseSong();
}

function loadSong() {
  const volume = localStorage.getItem("volume") ?? 0.5;
  currentSong = songs[currentSongIndex];
  currentSong.musicFile.currentTime = 0;
  currentSong.musicFile.addEventListener("timeupdate", updateProgress);
  currentSong.musicFile.volume = volume;

  titleElement.innerText = currentSong.title;
  linkElement.href = currentSong.spotifyLink
  mobileTitle.innerText = currentSong.title;
  coverElements.forEach((e) => {
    e.src = currentSong.coverArt + `?date=${Date.now()}`;
  });
  setVolumeButton(volume);
}
