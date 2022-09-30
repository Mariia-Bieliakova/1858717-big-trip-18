import AbstractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';

const MAX_DISPLAYED_DESTINATIONS = 3;

const createTripInfoTemplate = (getTripDestinations, getTripDates, getTripPrice) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripDestinations()}</h1>

      <p class="trip-info__dates">${getTripDates()}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripPrice()}</span>
    </p>
  </section>`
);

export default class TripInfoView extends AbstractView{
  #points = [];
  #offers = [];
  #destinations = [];

  constructor(points, offers, destinations) {
    super();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#getDestinations, this.#getTripDates, this.#getTripPrice);
  }

  #getDestinations = () => {
    if (!this.#points.length) {
      return '';
    }

    const selectedDestinations = this.#destinations
      .filter((destination) => this.#points
        .find((point) => point.destination === destination.id))
      .map((destination) => destination.name);

    if (selectedDestinations.length > MAX_DISPLAYED_DESTINATIONS) {
      const firstDestination = this.#destinations.find((destination) => this.#points[0].destination === destination.id).name;
      const lastDestination = this.#destinations.find((destination) => this.#points.at(-1).destination === destination.id).name;

      return [firstDestination, lastDestination].join(' &mdash; ... &mdash; ');
    }

    return selectedDestinations.join(' &mdash; ');
  };

  #getTripPrice = () => {
    if (!this.#points.length) {
      return '';
    }

    return this.#points.reduce((total, point) => {
      const offersByType = this.#offers.find((offer) => point.type === offer.type);

      const offersSum = offersByType.offers.reduce((acc, cur) => {
        if (point.offers.includes(cur.id)) {
          acc += cur.price;
        }

        return acc;
      }, 0);

      total += point.basePrice + offersSum;
      return total;
    }, 0);
  };

  #getTripDates = () => {
    if (this.#points.length === 0) {
      return '';
    }

    const dateFrom = dayjs(this.#points[0].dateFrom).format('D MMM');
    const dateTo = dayjs(this.#points.at(-1).dateTo).format('D MMM');

    return [dateFrom, dateTo].join(' - ');
  };
}
