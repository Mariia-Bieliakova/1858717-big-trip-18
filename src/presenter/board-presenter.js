import SortingView from '../view/sorting-view';
import TripPointsListView from '../view/trip-points-list-view';
import EditFormView from '../view/edit-form-view';
import TripPointView from '../view/trip-point-view';
import NoPointView from '../view/no-points-view';
import { NoPointMessage } from '../const';
import { isEscKey } from '../utils/common';
import { render, replace } from '../framework/render';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #noPointMessage = null;

  #boardPoints = [];
  #boardOffers = [];
  #boardDestinations = [];

  #listComponent = new TripPointsListView();

  constructor (boardContainer, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardOffers = [...this.#pointsModel.offers];
    this.#boardDestinations = [...this.#pointsModel.destinations];

    this.#renderBoard();
  };

  #renderPoint = (point, offers, destinations) => {
    const pointComponent = new TripPointView(point, offers, destinations);
    const editFormComponent = new EditFormView(point, offers, destinations);

    const replaceCardToForm = () => {
      replace(editFormComponent, pointComponent);
    };

    const replaceFormToCard = () => {
      replace(pointComponent, editFormComponent);
    };

    const closeEditForm = () => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    };

    function onEscKeyDown (evt) {
      if (isEscKey(evt)) {
        evt.preventDefault();
        closeEditForm();
      }
    }

    pointComponent.setRollupClickHandler(() => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editFormComponent.setFormSubmitHandler(closeEditForm);

    editFormComponent.setRollupClickHandler(closeEditForm);

    render(pointComponent, this.#listComponent.element);
  };

  #renderBoard = () => {
    render(new SortingView(), this.#boardContainer);

    this.#noPointMessage = NoPointMessage.EVERYTHING;

    if (this.#boardPoints.length === 0) {
      render(new NoPointView(this.#noPointMessage), this.#boardContainer);
      return;
    }
    render(this.#listComponent, this.#boardContainer);

    this.#boardPoints.forEach((point) => this.#renderPoint(point, this.#boardOffers, this.#boardDestinations));
  };
}
