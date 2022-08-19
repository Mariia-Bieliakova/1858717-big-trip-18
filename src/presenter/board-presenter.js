import SortingView from '../view/sorting-view';
import TripPointsListView from '../view/trip-points-list-view';
import EditFormView from '../view/edit-form-view';
import TripPointView from '../view/trip-point-view';
import { render } from '../render';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #boardPoints = [];
  #boardOffers = [];

  #listComponent = new TripPointsListView();

  constructor (boardContainer, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardOffers = [...this.#pointsModel.offers];

    render(new SortingView(), this.#boardContainer);
    render(this.#listComponent, this.#boardContainer);

    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i], this.#boardOffers);
    }
  };

  #renderPoint = (point, offers) => {
    const pointComponent = new TripPointView(point);
    const editFormComponent = new EditFormView(point, offers);

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
