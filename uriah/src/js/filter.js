// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// const dom = document.implementation.createHTMLDocument();
// dom.body.appendChild(document.getElementById("canvas"));

// ctx.drawImage();
document.addEventListener("DOMContentLoaded", () => {
  function randomizeAnimation() {
    const randomHeight = Math.random() * 130 + 20;
    const randomDelay = Math.random() * 5;
    const randomDuration = Math.random() * 2 + 1;
    const randomTimeout = Math.random() * 2000 + 1000;

    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
        .warp::after {
          height: ${randomHeight}px;
          animation-delay: ${randomDelay}s;
          animation-duration: ${randomDuration}s;
        }
      `;
    document.head.appendChild(styleElement);

    setTimeout(() => styleElement.remove(), randomTimeout);
  }

  setInterval(randomizeAnimation, 7000);
});
