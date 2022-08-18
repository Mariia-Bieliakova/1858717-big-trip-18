import { generatePoint } from '../mock/point';
import { generateOffers } from '../mock/offer';
import { generateDestinations } from '../mock/destination';
import { findUsedOffers, findDestination } from '../util';

export default class PointsModel {
  points = Array.from({length: 5}, generatePoint);
  offers = generateOffers();
  destination = generateDestinations();

  getOffers = () => this.offers;

  getPoints = () => {
    for (const point of this.points) {
      point.offers = findUsedOffers(point, this.offers);
      point.destination = findDestination(point, this.destination);
    }
    return this.points;
  };
}
