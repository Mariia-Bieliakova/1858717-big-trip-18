import SortingView from '../view/sorting-view';
import TripPointsListView from '../view/points-list-view';
import NoPointView from '../view/no-points-view';
import { NoPointMessage, SortType } from '../const';
import { render } from '../framework/render';
import PointPresenter from './point-presenter';
import { updateItem } from '../utils/common';
import { sortByDate, sortByDuration, sortByPrice } from '../utils/point';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #noPointMessage = null;

  #boardPoints = [];
  #boardOffers = [];
  #boardDestinations = [];

  #listComponent = new TripPointsListView();
  #sortComponent = new SortingView();
  #noPointComponent = null;

  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor (boardContainer, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#boardPoints = [...this.#pointsModel.points].sort(sortByDate);
    this.#boardOffers = [...this.#pointsModel.offers];
    this.#boardDestinations = [...this.#pointsModel.destinations];

    this.#renderBoard();
  };

  #renderPoint = (point, offers, destinations) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, offers, destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#boardOffers, this.#boardDestinations);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DURATION:
        this.#boardPoints.sort(sortByDuration);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortByPrice);
        break;
      default:
        this.#boardPoints.sort(sortByDate);
    }
    this.#currentSortType = sortType;
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointsList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#boardContainer);
    this.#sortPoints(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderNoPoints = (noPointMessage) => {
    this.#noPointComponent = new NoPointView(noPointMessage);
    render(this.#noPointComponent, this.#boardContainer);
  };

  #renderPoints = () => {
    this.#boardPoints.forEach((point) => this.#renderPoint(point, this.#boardOffers, this.#boardDestinations));
  };

  #renderPointsList = () => {
    render(this.#listComponent, this.#boardContainer);
    this.#renderPoints();
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderBoard = () => {
    this.#renderSort();

    this.#noPointMessage = NoPointMessage.EVERYTHING;

    if (this.#boardPoints.length === 0) {
      this.#renderNoPoints(this.#noPointMessage);
      return;
    }

    this.#renderPointsList();
  };
}
