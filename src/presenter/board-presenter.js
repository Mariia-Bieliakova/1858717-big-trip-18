import SortingView from '../view/sorting-view';
import TripPointsListView from '../view/trip-points-list-view';
import EditFormView from '../view/edit-form-view';
import TripPointView from '../view/trip-point-view';
import NoPointView from '../view/no-points-view';
import { render } from '../render';

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

  #renderBoard = () => {
    render(new SortingView(), this.#boardContainer);

    this.#noPointMessage = 'Click New Event to create your first point';

    if (this.#boardPoints.length === 0) {
      render(new NoPointView(this.#noPointMessage), this.#boardContainer);
    } else {
      render(this.#listComponent, this.#boardContainer);

      for (let i = 0; i < this.#boardPoints.length; i++) {
        this.#renderPoint(this.#boardPoints[i], this.#boardOffers, this.#boardDestinations);
      }
    }
  };

  #renderPoint = (point, offers, destinations) => {
    const pointComponent = new TripPointView(point, offers, destinations);
    const editFormComponent = new EditFormView(point, offers, destinations);

    const replaceCardToForm = () => {
      this.#listComponent.element.replaceChild(editFormComponent.element, pointComponent.element);
    };

    const replaceFormToCard = () => {
      this.#listComponent.element.replaceChild(pointComponent.element, editFormComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editFormComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editFormComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#listComponent.element);
  };
}
