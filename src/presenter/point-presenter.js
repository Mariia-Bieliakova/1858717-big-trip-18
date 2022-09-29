import TripPointView from '../view/point-view';
import EditFormView from '../view/edit-form-view';
import { replace, render, remove } from '../framework/render';
import { isEscKey } from '../utils/common';
import { UpdateType, UserAction, PointMode } from '../const';
import { isDatesEqual } from '../utils/point';

export default class PointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #editFormComponent = null;

  #point = null;
  #destinations = [];
  #mode = PointMode.DEFAULT;

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

    if (this.#mode === PointMode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === PointMode.EDITING) {
      replace(this.#pointComponent, prevEditFormComponent);
      this.#mode = PointMode.DEFAULT;
    }

    remove(prevEditFormComponent);
    remove(prevPointComponent);
  };

  destroy = () => {
    remove(this.#editFormComponent);
    remove(this.#pointComponent);
  };

  resetView = () => {
    if (this.#mode !== PointMode.DEFAULT) {
      this.#editFormComponent.reset(this.#point, this.#destinations);
      this.#replaceFormToCard();
    }
  };

  setSaving = () => {
    if (this.#mode === PointMode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === PointMode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  };

  setAborting = () => {
    if (this.#mode === PointMode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#editFormComponent.shake(resetFormState);
  };

  #replaceCardToForm = () => {
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = PointMode.EDITING;
  };

  #replaceFormToCard = () => {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = PointMode.DEFAULT;
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
