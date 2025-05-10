import html from "../pages/fun.html";
import { sfx } from "./sfx.js";

class Fun extends HTMLElement {
  static get tagName() {
    return "fun-page";
  }
  constructor() {
    super();
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.boopBuffer = null;
  }

  connectedCallback() {
    this.innerHTML = html;

    this.sortBox = this.querySelector('#sorting-div')
    this.initBtn = this.querySelector('#init-sort')
    this.bubSort = this.querySelector('#bubble-sort')
    this.selSort = this.querySelector('#selection-sort')
    this.insSort = this.querySelector('#insertion-sort')
    this.mrgSort = this.querySelector('#merge-sort')
    this.qckSort = this.querySelector('#quick-sort')
    this.numBars = this.querySelector('#sort-length')
    this.descriptionBox = this.querySelector('#description')
    this.speed = this.querySelector('#sort-speed')
    this.isSorting = false
    this.bars = null
    this.maxPitch = 10
    this.scrollEvent = new CustomEvent('scroll');

    this.Descriptions = new Map()
    this.Descriptions.set('bubble', "as sorting algorithms go, bubble sort is fairly dumb. it works its way through the values, comparing adjacent pairs, and swapping them as needed. it repeats this strategy until nothing more needs be swapped. it is simple but highly inefficient")
    this.Descriptions.set('selection', "selection sort works it way up the list finding the smallest value of the array, and swapping it with the current one. it then incremements its current position and begins the search again. it repeats this strategy, increasing the sorted portion of the list each time. taking one full pass, selection sort is slow but predictable")
    this.Descriptions.set('insertion', "insertion sort can be thought of as building a sorted portion of the list one value at a time (a list with only one value is necessarily sorted). it progresses up the list, comparing each value backward through the sorted portion and inserting it after the first value it is greater than. it repeats this strategy until sorted. it is often compared to how one might sort playing cards in hand")
    this.Descriptions.set('merge', "my favorite. merge sort is both more sophisticated and efficient than the previous three, however, it will appear slower here for demonstration purposes. merge sort works using recursion and the 'divide and conquer' strategy. the 'division' involves calling itself repeatedly (aka recursively) to split halves, and then split those halves, on and on until what's left is indivisible, in a way that is reminiscent of tree roots. it then 'conquers/combines' by merging its way back up each fragment, sorting as it goes")
    this.Descriptions.set('quick', "quick sort is usually the fastest/most efficient, but as with the merge demo, it has been slowed for better visualization. similar to merge sort, it uses recursion and the 'divide and conquer' strategy. it works by selecting a 'pivot' value (in this case, the last value). it then partitions the array by rearranging values so that everything smaller than the pivot is on the left, and everything larger on the right. this is done in place (as opposed to merge sort's separate lists) using two indices, where one defines the bounds of smaller values, and the other incremements up the list. after partitioning, the correct position of the pivot is now known and swapped to, as it is necessarily to the right of the partion of smaller values. this process is repeated recursively for the portions left and right of the pivot until indivisible, at which point each each value has had it's turn as 'pivot,' and has therefore found its correct position")

    this.preloadBoop();
    this.createBars()

    this.initBtn.addEventListener('click', () => this.createBars())
    this.bubSort.addEventListener('click', () => this.bubbleSortBars())
    this.selSort.addEventListener('click', () => this.selectionSortBars())
    this.insSort.addEventListener('click', () => this.insertionSortBars())
    this.mrgSort.addEventListener('click', () => this.mergeSortBars())
    this.qckSort.addEventListener('click', () => this.quickSortBars())
  }

  preloadBoop() {
    fetch("/sfx/boop.mp3")
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.boopBuffer = audioBuffer; // Store the decoded buffer
        console.log("Boop sound loaded successfully");
      })
      .catch(err => console.error("Failed to load boop sound:", err));
  }

  playBoop(playbackRate = 2) {
    if (!this.boopBuffer) {
      console.log("Buffer not ready, loading...");
      this.preloadBoop();
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.boopBuffer;
    source.playbackRate.value = playbackRate;
    source.connect(this.audioContext.destination);
    source.start();
  }

  createBars() {
    if (this.isSorting)
      return
    this.bars = this.numBars.value
    this.sortBox.innerHTML = null

    const values = []
    for (let i = 0; i < this.bars; i++) {
      values.push(i)
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
          ;[array[i], array[j]] = [array[j], array[i]]
      }
    }
    shuffle(values)

    values.forEach(val => {
      const barNode = document.createElement('div')
      const barClasses = ['bar', 'bg-primary', 'w-full', 'min-w-6', 'rounded-sm', 'transition-all', 'bg-opacity-75', 'duration-100', 'shadow-primary', 'relative']
      barNode.classList.add(...barClasses)

      const height = (val + 1) / this.bars * 100
      barNode.style.height = `${height}%`

      barNode.innerText = val + 1

      const label = document.createElement('span')
      label.innerText = val + 1
      label.classList.add('text-black')
      barNode.innerHTML = ''
      barNode.appendChild(label)

      this.sortBox.appendChild(barNode)
    })
  }

  async finale() {
    const speed = this.speed.value
    const finalBars = Array.from(this.sortBox.children)

    this.playBoop(1)
    this.playBoop(2)
    this.playBoop(3)
    finalBars.forEach(bar => { bar.classList.add('scale-x-75', '!bg-opacity-100', 'shadow-sm') })
    await new Promise(r => setTimeout(r, speed * 2))
    finalBars.forEach(bar => { bar.classList.remove('scale-x-75') })
    this.playBoop(2)
    this.playBoop(4)
    this.playBoop(8)
    await new Promise(r => setTimeout(r, speed * 2))
    this.playBoop(3)
    this.playBoop(6)
    this.playBoop(9)
    finalBars.forEach(bar => { bar.classList.add('scale-y-110') })
    await new Promise(r => setTimeout(r, speed * 2))
    finalBars.forEach(bar => { bar.classList.remove('scale-y-110', '!bg-opacity-100', 'shadow-sm') })

    for (const bar of finalBars) {
      const value = parseFloat(bar.innerText)
      const pitch = value / this.bars * this.maxPitch
      this.playBoop(pitch)
      bar.classList.add('!bg-opacity-100', 'scale-x-75')
      setTimeout(() => {
        bar.classList.remove('!bg-opacity-100', 'scale-x-75')
      }, speed / 2)
      await new Promise(r => setTimeout(r, speed / 2))
    }

    this.isSorting = false

  }

  async bubbleSortBars() {
    this.descriptionBox.innerText = this.Descriptions.get('bubble')
    window.dispatchEvent(this.scrollEvent)
    if (this.isSorting) return
    this.isSorting = true
    let speed = this.speed.value
    let sorted = false

    while (!sorted) {
      sorted = true
      const bars = Array.from(this.sortBox.children)

      for (let i = 0; i < bars.length - 1; i++) {
        const valueA = parseFloat(bars[i].innerText - 1)
        const valueB = parseFloat(bars[i + 1].innerText - 1)
        speed = this.speed.value

        if (valueA > valueB) {
          const pitch = valueA / this.bars * this.maxPitch
          this.playBoop(pitch)
          sorted = false
          this.sortBox.insertBefore(bars[i + 1], bars[i])
          const div = bars[i]
          div.classList.add('!bg-opacity-100', 'scale-x-75')
          setTimeout(() => {
            div.classList.remove('!bg-opacity-100', 'scale-x-75')
          }, speed / 2)
          await new Promise(r => setTimeout(r, speed))
        }
      }
    }
    this.finale()

  }

  async selectionSortBars() {
    this.descriptionBox.innerText = this.Descriptions.get('selection')
    window.dispatchEvent(this.scrollEvent)
    if (this.isSorting) return
    this.isSorting = true
    let speed = this.speed.value

    const totalBars = this.bars

    for (let i = 0; i < totalBars - 1; i++) {
      let bars = Array.from(this.sortBox.children)
      let minIndex = i

      for (let j = i + 1; j < totalBars; j++) {
        speed = this.speed.value
        const valueJ = parseFloat(bars[j].innerText)
        const valueMin = parseFloat(bars[minIndex].innerText)
        if (valueJ < valueMin) {
          minIndex = j
        }
      }

      if (minIndex !== i) {
        bars = Array.from(this.sortBox.children)

        const barI = bars[i]
        const barMin = bars[minIndex]

        this.sortBox.insertBefore(barMin, barI)
        this.sortBox.insertBefore(barI, barMin.nextSibling)

        const pitch = parseFloat(barMin.innerText) / this.bars * this.maxPitch
        this.playBoop(pitch)

        barMin.classList.add('!bg-opacity-100', 'scale-x-75')
        setTimeout(() => {
          barMin.classList.remove('!bg-opacity-100', 'scale-x-75')
        }, speed / 2)

        await new Promise(r => setTimeout(r, speed))
      }
    }

    this.finale()
  }
  async insertionSortBars() {
    this.descriptionBox.innerText = this.Descriptions.get('insertion')
    window.dispatchEvent(this.scrollEvent)
    if (this.isSorting) return;
    this.isSorting = true;
    let speed = this.speed.value;
    const totalBars = this.bars;

    for (let i = 1; i < totalBars; i++) {
      let bars = Array.from(this.sortBox.children);
      const currentBar = bars[i];
      const currentValue = parseFloat(currentBar.innerText);

      let j = i - 1;

      while (j >= 0) {
        bars = Array.from(this.sortBox.children);
        const compareValue = parseFloat(bars[j].innerText);

        if (compareValue <= currentValue) break;

        j--;
      }

      bars = Array.from(this.sortBox.children);
      const target = bars[j + 1];

      const pitch = currentValue / this.bars * this.maxPitch;
      this.playBoop(pitch);

      currentBar.classList.add('!bg-opacity-100', 'scale-x-75');
      setTimeout(() => {
        currentBar.classList.remove('!bg-opacity-100', 'scale-x-75');
      }, speed / 2);

      this.sortBox.insertBefore(currentBar, target);

      await new Promise((r) => setTimeout(r, speed));
    }

    this.finale();
  }

  async mergeSortBars() {
    this.descriptionBox.innerText = this.Descriptions.get('merge')
    window.dispatchEvent(this.scrollEvent)
    if (this.isSorting) return;
    this.isSorting = true;
    const bars = Array.from(this.sortBox.children);
    const speed = this.speed.value;

    await this.mergeSort(bars, 0, bars.length - 1, speed);

    this.finale();
  }

  async mergeSort(bars, start, end, speed) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await this.mergeSort(bars, start, mid, speed);
    await this.mergeSort(bars, mid + 1, end, speed);
    await this.merge(bars, start, mid, end, speed);
  }

  async merge(bars, start, mid, end, speed) {
    const left = Array.from(this.sortBox.children).slice(start, mid + 1);
    const right = Array.from(this.sortBox.children).slice(mid + 1, end + 1);
    const merged = [];

    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      const valL = parseFloat(left[i].innerText);
      const valR = parseFloat(right[j].innerText);

      if (valL <= valR) {
        merged.push(left[i++]);
      } else {
        merged.push(right[j++]);
      }
    }

    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);

    for (let k = 0; k < merged.length; k++) {
      const pitch = parseFloat(merged[k].innerText) / this.bars * this.maxPitch;
      this.playBoop(pitch);

      merged[k].classList.add('!bg-opacity-100', 'scale-x-75');
      setTimeout(() => {
        merged[k].classList.remove('!bg-opacity-100', 'scale-x-75');
      }, speed / 2);

      this.sortBox.insertBefore(merged[k], this.sortBox.children[start + k]);
      await new Promise(r => setTimeout(r, speed));
    }
  }

  async quickSortBars() {
    this.descriptionBox.innerText = this.Descriptions.get('quick')
    window.dispatchEvent(this.scrollEvent)
    if (this.isSorting) return
    this.isSorting = true

    const bars = Array.from(this.sortBox.children)
    await this._quickSort(0, bars.length - 1)

    this.finale()
  }

  async _quickSort(low, high) {
    if (low < high) {
      const pivotIndex = await this._partition(low, high)
      await this._quickSort(low, pivotIndex - 1)
      await this._quickSort(pivotIndex + 1, high)
    }
  }

  async _partition(low, high) {
    const speed = this.speed.value
    const bars = Array.from(this.sortBox.children)
    const pivotValue = parseFloat(bars[high].innerText)
    let i = low - 1

    for (let j = low; j < high; j++) {
      const currentBars = Array.from(this.sortBox.children)
      const value = parseFloat(currentBars[j].innerText)
      if (value < pivotValue) {
        i++
        await this._swapDOMBars(i, j)
      }
    }

    await this._swapDOMBars(i + 1, high)
    return i + 1
  }

  async _swapDOMBars(indexA, indexB) {
    if (indexA === indexB) return

    const speed = this.speed.value
    const bars = Array.from(this.sortBox.children)
    const barA = bars[indexA]
    const barB = bars[indexB]

    // Swap in DOM
    this.sortBox.insertBefore(barB, barA)
    this.sortBox.insertBefore(barA, barB.nextSibling)

    // Animation and sound
    const pitch = parseFloat(barB.innerText) / this.bars * this.maxPitch
    this.playBoop(pitch)
    barB.classList.add('!bg-opacity-100', 'scale-x-75')
    setTimeout(() => {
      barB.classList.remove('!bg-opacity-100', 'scale-x-75')
    }, speed / 2)

    await new Promise(r => setTimeout(r, speed))
  } disconnectedCallback() { }
}

customElements.define(Fun.tagName, Fun);
export default Fun;
