import { render, remove, RenderPosition } from '../framework/render';
import EditFormView from '../view/edit-form-view';
import { nanoid } from 'nanoid';
import { UserAction, UpdateType, BLANK_POINT } from '../const';
import { isEscKey } from '../utils/common';

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #editFormComponent = null;
  #destroyCallback = null;
  #pointsModel = null;

  #offers = [];
  #destinations = [];

  constructor(pointListContainer, changeData, pointModel) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#pointsModel = pointModel;

    this.#offers = this.#pointsModel.offers;
    this.#destinations = this.#pointsModel.destinations;
  }

  get blankPoint() {
    return {
      ...BLANK_POINT
    };
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editFormComponent !== null) {
      return;
    }

    this.#editFormComponent = new EditFormView(this.blankPoint, this.#offers, this.#destinations, 'create');
    this.#editFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editFormComponent.setRollupClickHandler(this.#handleCloseEditForm);
    this.#editFormComponent.setCancelClickHandler(this.#handleCancelClick);

    render(this.#editFormComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#editFormComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#editFormComponent);
    this.#editFormComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point}
    );

    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleCloseEditForm = () => {
    this.destroy();
  };
}
