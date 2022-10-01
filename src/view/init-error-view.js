import AbstractView from '../framework/view/abstract-view';

const createErrorTemplate = () => (`
  <p class="trip-events__msg">
    Something went wrong :( Please try again.
  </p>
`);

export default class InitErrorView extends AbstractView {
  get template() {
    return createErrorTemplate();
  }
}
