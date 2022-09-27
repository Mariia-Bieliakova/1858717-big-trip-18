import SortingView from '../view/sorting-view';
import TripPointsListView from '../view/points-list-view';
import NoPointView from '../view/no-points-view';
import LoadingView from '../view/loading-view';
import { FilterType, NoPointMessage, SortType, UpdateType, UserAction } from '../const';
import { remove, render, RenderPosition } from '../framework/render';
import PointPresenter from './point-presenter';
import PointNewPresenter from './new-point-presenter';
import { sortByDate, sortByDuration, sortByPrice } from '../utils/point';
import { filterPoints } from '../utils/filter';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #noPointMessage = null;

  #listComponent = new TripPointsListView();
  #sortComponent = null;
  #noPointComponent = null;
  #loadingComponent = new LoadingView();

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  constructor (boardContainer, pointsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#listComponent.element, this.#handleViewAction, this.#pointsModel);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const points = this.#pointsModel.points;
    const filterType = this.#filterModel.filter;
    const filteredPoints = filterPoints(filterType, points);

    switch (this.#currentSortType) {
      case SortType.DURATION:
        return filteredPoints.sort(sortByDuration);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.DEFAULT:
        return filteredPoints.sort(sortByDate);
      default:
        throw new Error(`Unknown sort type: ${this.#currentSortType}`);
    }
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init = () => {
    render(this.#listComponent, this.#boardContainer);
    this.#renderBoard();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };

  #renderPoint = (point, offers, destinations) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handleViewAction, this.#modeChangeHandler);
    pointPresenter.init(point, offers, destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.offers, this.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      default:
        throw new Error(`Unknown update type: ${updateType}`);
    }
  };

  #modeChangeHandler = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandler);

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoPoints = (noPointMessage) => {
    this.#noPointComponent = new NoPointView(noPointMessage);
    render(this.#noPointComponent, this.#listComponent.element);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point, this.offers, this.destinations));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#boardContainer);
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;

    this.#noPointMessage = NoPointMessage[this.#filterModel.filter];

    if (points.length === 0) {
      this.#renderNoPoints(this.#noPointMessage);
      return;
    }

    this.#renderSort();

    this.#renderPoints(points);
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
