import AbstractView from '../framework/view/abstract-view';
import { humanizePointDate, humanizePointTime, durationInPoint, findDestination, findSelectedOffers} from '../utils/point';

const createOffersTemplate = (offers) => {
  if (!offers) {
    return '';
  }

  return offers.map((offer) => (`
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
    `)).join('');
};


const createPointTemplate = (point, offers, destinations) => {
  const {dateFrom, dateTo, basePrice, type, isFavorite} = point;

  const dateStart = humanizePointDate(dateFrom);
  const timeStart = humanizePointTime(dateFrom);
  const timeFinish = humanizePointTime(dateTo);
  const duration = durationInPoint(dateFrom, dateTo);

  const selectedOffers = findSelectedOffers(point, offers);
  const userDestination = findDestination(point, destinations);

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  const typeOfPoint = type[0].toUpperCase() + type.slice(1);

  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${dateStart}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typeOfPoint} ${userDestination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${timeStart}</time>
                      &mdash;
            <time class="event__end-time" datetime="${dateTo}">${timeFinish}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate(selectedOffers)}
        </ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
};

export default class TripPointView extends AbstractView {
  #point = null;
  #offers = null;
  #destinations = null;

  constructor (point, offers, destinations) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  setRollupClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };
}
