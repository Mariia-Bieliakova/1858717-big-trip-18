import { createElement } from '../render.js';

const createNoPointMessageTemplate = (message) => (
  `<p class="trip-events__msg">${message}</p>`
);

export default class NoPointView {
  #element = null;
  #message = null;

  constructor (message) {
    this.#message = message;
  }

  get template() {
    return createNoPointMessageTemplate(this.#message);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
