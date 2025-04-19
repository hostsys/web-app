import html from "../pages/read.html";
import ReadWrites from "./ReadWrites";

class Read extends HTMLElement {
  static get tagName() {
    return "read-post";
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.postId = this.args || null
    this.innerHTML = html;
    this.getPost()

    this.titleDiv = this.querySelector('#post-title')
    this.contentDiv = this.querySelector('#post-content')
    this.dateDiv = this.querySelector('#post-date')
    this.successDiv = this.querySelector('#success')
    this.failureDiv = this.querySelector('#failure')
  }

  async getPost() {
    const getRoute = `https://uriah.website/wp-json/wp/v2/posts/${this.postId}`
    try {
      const postResponse = await fetch(getRoute).then(r => {
        if (!r.ok) throw new Error(`HTTP error ${r.status}`);
        return r.json();
      });
      console.log(postResponse.content.rendered)
      this.renderPost(postResponse)
    } catch (err) {
      this.failureDiv.classList.add('opacity-100')
      console.log('failed to get post: ', err)
      return
    }
  }

  renderPost(data) {
    this.successDiv.classList.add('opacity-100')
    this.failureDiv.classList.add('hidden')
    this.titleDiv.innerHTML = data.title.rendered
    this.contentDiv.innerHTML = data.content.rendered
    this.dateDiv.innerText = new Date(data.date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    })
  }

  disconnectedCallback() { }
}

customElements.define(Read.tagName, Read);
export default Read;
