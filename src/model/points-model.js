import { generatePoint } from '../mock/point';
import { generateOffers } from '../mock/offer';
import { generateDestinations } from '../mock/destination';
import Observable from '../framework/observable';

export default class PointsModel extends Observable {
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

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType);
  };
}
