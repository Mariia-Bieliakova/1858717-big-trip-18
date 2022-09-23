import AbstractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';

const MAX_DISPLAYED_DESTINATIONS = 3;

const getDestinations = (points, destinations) => {
  if (points.length === 0) {
    return 'Your route';
  }

  let selectedDestinations = destinations
    .filter((destination) => points
      .find((point) => point.destination === destination.id));

  selectedDestinations = selectedDestinations.map((destination) => destination.name);

  if (selectedDestinations.length > MAX_DISPLAYED_DESTINATIONS) {
    return [selectedDestinations[0], selectedDestinations.at(-1)].join(' &mdash; ... &mdash; ');
  }

  return selectedDestinations.join(' &mdash; ');
};

const getTripValue = (points) => {
  if (points.length === 0) {
    return 0;
  }

  const basePricesSum = points.reduce((total, point) => total + Number(point.basePrice), 0);

  return basePricesSum;
};

const getTripDates = (points) => {
  if (points.length === 0) {
    return '... - ...';
  }

  const dateFrom = dayjs(points[0].dateFrom).format('D MMM');
  const dateTo = dayjs(points[points.length - 1].dateTo).format('D MMM');

  return [dateFrom, dateTo].join(' - ');
};

const createTripInfoTemplate = (points, destinations) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getDestinations(points, destinations)}</h1>

      <p class="trip-info__dates">${getTripDates(points)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripValue(points)}</span>
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
    return createTripInfoTemplate(this.#points, this.#destinations);
  }
}
