import { generatePoint } from '../mock/point';
import { generateOffers } from '../mock/offer';
import { generateDestinations } from '../mock/destination';

export default class PointsModel {
  #points = Array.from({length: 5}, generatePoint);
  #offers = generateOffers();
  #destinations = generateDestinations();

  get destinations () {
    return this.#destinations;
  }

  get offers () {
    return this.#offers;
  }

  get points () {
    return this.#points;
  }
}
