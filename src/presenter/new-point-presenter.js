import { render, remove, RenderPosition } from '../framework/render';
import EditFormView from '../view/edit-form-view';
import { UserAction, UpdateType, BLANK_POINT, FormType } from '../const';
import { isEscKey } from '../utils/common';

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #editFormComponent = null;
  #destroyCallback = null;
  #pointsModel = null;

  constructor(pointListContainer, changeData, pointModel) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#pointsModel = pointModel;
  }

  get blankPoint() {
    return {
      ...BLANK_POINT
    };
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editFormComponent !== null) {
      return;
    }

    this.#editFormComponent = new EditFormView(this.blankPoint, this.offers, this.destinations, FormType.CREATING);
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

  setSaving = () => {
    this.#editFormComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#editFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#editFormComponent.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
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
