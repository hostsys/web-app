const html = `
  <!-- column 1 -->
  <div id="hcol1" class="pr-4 text-right md:pr-14">
    <a href="/" id="home">home</a><br />
    <a href="/portfolio" id="portfolio">portfolio</a>
    <br />
    <a href="/controls" id="controls">controls</a>
  </div>
  <!-- column 2 -->
  <div id="hcol2" class="flex justify-center">
    <!-- <img alt="star" src="star-texture.png" /> -->
    <canvas id="eyebox"> </canvas>
  </div>
  <!-- column 3 -->
  <div id="hcol3" class="pl-4 text-left md:pl-14">
    <a href="/music" id="music">music</a> <br />
    <a href="/gallery" id="gallery">gallery</a> <br />
    <a href="/the-box" id="the-box">box</a>
  </div>
`;

class NavMenu extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = html;
  }
}

customElements.define("nav-menu", NavMenu);
