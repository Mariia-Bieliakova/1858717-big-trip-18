import AbstractView from '../framework/view/abstract-view';

const createListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripPointsListView extends AbstractView{
  get template() {
    return createListTemplate();
  }
}
