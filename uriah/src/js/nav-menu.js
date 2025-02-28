const html = `
  <!-- column 1 -->
  <div id="hcol1" class="crtext flex flex-col gap-0 pr-4 text-right max-sm:text-sm md:pr-14">
    <a class="px-1" href="/" id="home">home</a>
    <a class="px-1 "href="/portfolio" id="portfolio">portfolio</a>
    <a class="px-1" href="/controls" id="controls">controls</a>
  </div>
  <!-- column 2 -->
  <div id="hcol2" class="flex justify-center">
    <!-- <img alt="star" src="star-texture.png" /> -->
    <canvas id="eyebox"> </canvas>
  </div>
  <!-- column 3 -->
  <div id="hcol3" class="crtext flex flex-col gap-0 pl-4 text-left max-sm:text-sm md:pl-14">
    <a class="px-1" href="/music" id="music">music</a> 
    <a class="px-1" href="/guest-book" id="guest-book">guest book</a>
    <a class="px-1" href="/the-box" id="the-box">box</a>
  </div>
`;

class NavMenu extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = html;
  }
}

customElements.define("nav-menu", NavMenu);
