import TripPointView from '../view/point-view';
import EditFormView from '../view/edit-form-view';
import { replace, render, remove } from '../framework/render';
import { isEscKey } from '../utils/common';
import { UpdateType, UserAction } from '../const';
import { isDatesEqual } from '../utils/point';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #editFormComponent = null;

  #point = null;
  #destinations = [];
  #mode = Mode.DEFAULT;

  constructor (pointListContainer, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, offers, destinations) => {
    this.#point = point;
    this.#destinations = destinations;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new TripPointView(point, offers, destinations);
    this.#editFormComponent = new EditFormView(point, offers, destinations);

    this.#pointComponent.setRollupClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editFormComponent.setRollupClickHandler(this.#handleCloseEditForm);
    this.#editFormComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevEditFormComponent === null || prevPointComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    remove(prevEditFormComponent);
    remove(prevPointComponent);
  };

  destroy = () => {
    remove(this.#editFormComponent);
    remove(this.#pointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editFormComponent.reset(this.#point, this.#destinations);
      this.#replaceFormToCard();
    }
  };

  #replaceCardToForm = () => {
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToCard = () => {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.#editFormComponent.reset(this.#point, this.#destinations);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleCloseEditForm = () => {
    this.#editFormComponent.reset(this.#point, this.#destinations);
    this.#replaceFormToCard();
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = !isDatesEqual(this.#point.dateFrom, update.dateFrom)
        ||
      !isDatesEqual(this.#point.dateTo, update.dateTo)
        ||
      this.#point.basePrice !== update.basePrice
        ||
      this.#point.type !== update.type;

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );

    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
