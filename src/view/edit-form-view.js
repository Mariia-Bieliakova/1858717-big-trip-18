import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeFullDate, isOfferChecked, findDestination} from '../utils/point';
import { TYPE, FormType } from '../const';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createTypeListTemplate = (point, types) => types.map((type) => {
  const typeOfPoint = type[0].toUpperCase() + type.slice(1);
  const isChecked = Boolean(point.type === type);

  return (`
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${typeOfPoint}</label>
    </div>
  `);
}).join('');

const createAvailableOffersTemplate = (point, availableOffers, isDisabled) => (
  availableOffers.offers.map((offer) => (`
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${point.type}-${offer.id}"
        type="checkbox" name="event-offer-${point.type}"
        ${isOfferChecked(offer, point) ? 'checked' : ''}
        data-offer-id="${offer.id}"
        ${isDisabled ? 'disabled' : ''}
      >
      <label
        class="event__offer-label"
        for="event-offer-${point.type}-${offer.id}"
      >
        <span class="event__offer-title">${offer.title}</span>
         &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `)).join('')
);

const createOffersTemplate = (point, offers, isDisabled) => {
  const offersByType = offers.find((offer) => point.type === offer.type);

  if (!offersByType || !offersByType.offers) {
    return '';
  }

  return (`
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createAvailableOffersTemplate(point, offersByType, isDisabled)}
      </div>
    </section>
  `);
};

const createImagesTemplate = (destination) => destination.pictures.map((picture) =>
  `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

const createImageContainerTemplate = (destination) => (`
  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${createImagesTemplate(destination)}
    </div>
  </div>
`);

const createDescriptionTemplate = (pickedDestination) => {
  if (!pickedDestination) {
    return '';
  }

  return (`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${pickedDestination.description}</p>

      ${createImageContainerTemplate(pickedDestination)}
    </section>
  `);
};

const createResetButtonText = (formType, isDeleting) => {
  if (formType === FormType.EDITING) {
    if (isDeleting) {
      return 'Deleting...';
    }
    return 'Delete';
  }

  return 'Cancel';
};

const createEditFormTemplate = (point, offers, destinations, typeOfForm) => {
  const {
    type,
    dateFrom,
    dateTo,
    basePrice,
    isDisabled,
    isDeleting,
    isSaving} = point;

  const dateStart = humanizeFullDate(dateFrom);
  const dateFinish = humanizeFullDate(dateTo);

  const typeOfPoint = type[0].toUpperCase() + type.slice(1);

  const pickedDestination = findDestination(point, destinations);

  return (`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypeListTemplate(point, TYPE)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${point.id}">
              ${typeOfPoint}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-${point.id}"
              type="text"
              name="event-destination"
              value="${pickedDestination ? he.encode(pickedDestination.name) : ''}" list="destination-list-1"
              ${isDisabled ? 'disabled' : ''}
            >
            <datalist id="destination-list-1">
              ${destinations.map((item) => `<option value="${item.name}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${dateStart}"
              ${isDisabled ? 'disabled' : ''}
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${dateFinish}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              value="${basePrice}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
            ${createResetButtonText(typeOfForm, isDeleting)}
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">

          ${createOffersTemplate(point, offers, isDisabled)}

          ${createDescriptionTemplate(pickedDestination)}
        </section>
      </form>
    </li>
  `);
};

export default class EditFormView extends AbstractStatefulView{
  #offers = null;
  #destinations = null;
  #dateFromPicker = null;
  #dateToPicker = null;
  #formType = null;

  constructor (point, offers, destinations, formType = FormType.EDITING) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
    this.#formType = formType;
    this._state = EditFormView.parsePointToState(point, this.#formType);

    this.#setInnerHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#offers, this.#destinations, this.#formType);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;

    if (this.#formType === FormType.CREATING) {
      return;
    }

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  setCancelClickHandler = (callback) => {
    this._callback.cancelClick = callback;

    if (this.#formType === FormType.EDITING) {
      return;
    }

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formCancelClickHandler);
  };

  setRollupClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  };

  reset = (point, destinations) => {
    this.updateElement(EditFormView.parsePointToState(point, destinations));
  };

  removeElement = () => {
    super.removeElement();

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }

    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  };

  #setDateFromPicker = () => {
    this.#dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._state.dateTo,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        'time_24hr': true
      }
    );
  };

  #setDateToPicker = () => {
    this.#dateToPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        'time_24hr': true
      }
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerSelectHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.#setDateFromPicker();
    this.#setDateToPicker();
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupClickHandler(this._callback.click);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCancelClickHandler(this._callback.cancelClick);
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
    });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
        offers: []
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const pickedDestination = this.#destinations.find((destination) =>
      evt.target.value === destination.name);

    if (!pickedDestination) {
      evt.target.value = '';

      return;
    }

    this.updateElement({
      destination: pickedDestination.id
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      basePrice: Number(evt.target.value)
    });
  };

  #offerSelectHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      const clickedOfferId = Number(evt.target.dataset.offerId);
      const hasOffer = this._state.offers.includes(clickedOfferId);

      const updatedOffers = hasOffer ?
        this._state.offers.filter((offer) => offer.id !== clickedOfferId)
        :
        this._state.offers.concat(clickedOfferId);

      this._setState({offers: updatedOffers});
    }
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const destinationInput = this.element.querySelector('.event__input--destination');
    const submitButton = this.element.querySelector('.event__save-btn');
    const priceInput = this.element.querySelector('.event__input--price');

    if (priceInput.value < 1) {
      submitButton.disabled = true;
      return;
    }

    if (destinationInput.value === '') {
      submitButton.disabled = true;
      return;
    }

    this._callback.formSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditFormView.parseStateToPoint(this._state));
  };

  #formCancelClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cancelClick(EditFormView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => ({...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isDisabled;
    delete point.isDeleting;
    delete point.isSaving;

    return point;
  };
}
