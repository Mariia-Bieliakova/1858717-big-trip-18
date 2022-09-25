import TripInfoView from '../view/trip-info-view';
import { remove, render, RenderPosition } from '../framework/render';
import { sortByDate } from '../utils/point';

export default class TripInfoPresenter {
  #infoContainer = null;
  #tripInfoComponent = null;
  #pointsModel = null;
  #points = [];
  #offers = [];
  #destinations = [];
  #boardPoints = new Map();

  constructor (infoContainer, pointsModel) {
    this.#infoContainer = infoContainer;
    this.#pointsModel = pointsModel;

    this.#points = this.#pointsModel.points;
    this.#offers = this.#pointsModel.offers;
    this.#destinations = this.#pointsModel.destinations;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#points.sort(sortByDate);
    this.#tripInfoComponent = new TripInfoView(this.#points, this.#offers, this.#destinations);

    render(this.#tripInfoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
    this.#boardPoints.clear();
  };

  #handleModelEvent = () => {
    remove(this.#tripInfoComponent);

    this.#points = this.#pointsModel.points;
    this.#destinations = this.#pointsModel.destinations;

    this.init();
  };
}
