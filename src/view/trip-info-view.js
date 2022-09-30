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
    const firstDestination = destinations.find((destination) => points[0].destination === destination.id).name;
    const lastDestination = destinations.find((destination) => points.at(-1).destination === destination.id).name;

    return [firstDestination, lastDestination].join(' &mdash; ... &mdash; ');
  }

  return selectedDestinations.join(' &mdash; ');
};

const getTripValue = (points, offers) => {
  if (points.length === 0) {
    return 0;
  }

  const basePricesSum = points.reduce((total, point) => total + point.basePrice, 0);
  let offersPriceSum = 0;

  for (const point of points) {
    const offersByType = offers.find((offer) => point.type === offer.type);

    for (const offer of offersByType.offers) {
      if (point.offers.includes(offer.id)) {
        offersPriceSum += offer.price;
      }
    }
  }

  const fullTripPrice = basePricesSum + offersPriceSum;

  return fullTripPrice;
};

const getTripDates = (points) => {
  if (points.length === 0) {
    return '... - ...';
  }

  const dateFrom = dayjs(points[0].dateFrom).format('D MMM');
  const dateTo = dayjs(points.at(-1).dateTo).format('D MMM');

  return [dateFrom, dateTo].join(' - ');
};

const createTripInfoTemplate = (points, offers, destinations ) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getDestinations(points, destinations)}</h1>

      <p class="trip-info__dates">${getTripDates(points)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripValue(points, offers)}</span>
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
    return createTripInfoTemplate(this.#points, this.#offers, this.#destinations);
  }
}
