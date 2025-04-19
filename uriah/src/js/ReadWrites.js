import html from "../pages/read-writes.html";

class ReadWrites extends HTMLElement {
  static get tagName() {
    return "read-writes";
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html;
    this.writesContainer = this.querySelector("#posts-container");
    this.writesTemplate = this.querySelector("#post-template");
    this.thoughtsContainer = this.querySelector("#thoughts-container");
    this.thoughtsTemplate = this.querySelector("#thoughts-template");
    this.querySelector("#random-post").addEventListener('click', () => this.randomPost())
    this.getPosts()
    this.getThoughts()

    this.loadEvent = new CustomEvent('navEvent');

    this.postIds = []
  }

  randomPost() {
    const randomPostId = this.postIds[Math.floor(Math.random() * this.postIds.length)]
    window.dispatchEvent(new CustomEvent('navigate', { detail: { route: `/read-writes/${randomPostId}` } }))
    const currentPath = window.location.pathname;
    if (currentPath.includes('/read-writes/')) {
      const newPath = currentPath.replace(/\/read-writes\/\d*$/, `/read-writes/${randomPostId}`);
      window.history.pushState({ id: randomPostId }, '', newPath);
    } else {
      window.history.pushState({ id: randomPostId }, '', `/read-writes/${randomPostId}`);
    }
  }

  async getPosts() {
    const perPage = 20;
    let page = 1;
    let allReads = [];
    let hasMore = true;

    while (hasMore) {
      const getRoute = `https://uriah.website/wp-json/wp/v2/posts?categories=4&per_page=${perPage}&page=${page}`;
      try {
        const response = await fetch(getRoute);

        if (!response.ok) {
          if (response.status === 400) {
            hasMore = false;
            break;
          }
          throw new Error(`HTTP error ${response.status}`);
        }

        const reads = await response.json();

        if (reads.length === 0) {
          hasMore = false;
          break;
        }

        allReads = [...allReads, ...reads];
        page++;

        if (reads.length < perPage) {
          hasMore = false;
          this.postIds = [...this.postIds, ...allReads.map(read => read.id)]
        }

      } catch (err) {
        console.log('failed to get posts: ', err);
        hasMore = false;
      }
    }
    this.renderPosts(allReads);
  }

  async getThoughts() {
    const perPage = 20;
    let page = 1;
    let allThoughts = [];
    let hasMore = true;

    while (hasMore) {
      const getRoute = `https://uriah.website/wp-json/wp/v2/posts?categories=5&per_page=${perPage}&page=${page}`;
      try {
        const response = await fetch(getRoute);

        if (!response.ok) {
          if (response.status === 400) {
            hasMore = false;
            break;
          }
          throw new Error(`HTTP error ${response.status}`);
        }

        const thoughts = await response.json();

        if (thoughts.length === 0) {
          hasMore = false;
          break;
        }

        allThoughts = [...allThoughts, ...thoughts];
        page++;

        if (thoughts.length < perPage) {
          hasMore = false;
          this.postIds = [...this.postIds, ...allThoughts.map(thought => thought.id)]
        }

      } catch (err) {
        console.log('failed to get posts: ', err);
        hasMore = false;
      }
    }

    this.renderThoughts(allThoughts);
  }

  renderPosts(posts) {
    this.writesContainer.innerHTML = "";
    posts.forEach((post) => {
      const postDiv = this.writesTemplate.content.cloneNode(true);

      const title = postDiv.querySelector("#post-title");
      title.innerHTML = post.title.rendered;
      title.setAttribute('href', `/read-writes/${post.id}`)

      const excerpt = postDiv.querySelector("#post-excerpt");
      excerpt.innerHTML = post.excerpt.rendered;

      const date = postDiv.querySelector("#post-date")
      date.innerText = new Date(post.date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
      })

      this.writesContainer.appendChild(postDiv);
      window.dispatchEvent(this.loadEvent)
    });
  }

  renderThoughts(posts) {
    this.thoughtsContainer.innerHTML = "";
    posts.forEach((post) => {
      const thoughtDiv = this.thoughtsTemplate.content.cloneNode(true);

      const title = thoughtDiv.querySelector("#thought-title");
      title.innerHTML = post.title.rendered;

      const thought = thoughtDiv.querySelector("#thought");
      thought.innerHTML = post.content.rendered;

      const date = thoughtDiv.querySelector("#thought-date")
      date.innerText = new Date(post.date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
      })

      this.thoughtsContainer.appendChild(thoughtDiv);
      window.dispatchEvent(this.loadEvent)
    });
  }

  disconnectedCallback() { }
}

customElements.define(ReadWrites.tagName, ReadWrites);
export default ReadWrites;
