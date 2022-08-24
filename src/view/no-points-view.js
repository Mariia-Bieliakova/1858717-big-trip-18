import AbstractView from '../framework/view/abstract-view';

const createNoPointMessageTemplate = (message) => (
  `<p class="trip-events__msg">${message}</p>`
);

export default class NoPointView extends AbstractView{
  #message = null;

  constructor (message) {
    super();
    this.#message = message;
  }

  get template() {
    return createNoPointMessageTemplate(this.#message);
  }
}
