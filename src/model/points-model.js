import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class PointsModel extends Observable {
  #pointApiService = null;
  #points = [];
  #offers = [];
  #destinations = [];

  constructor(pointApiService) {
    super();
    this.#pointApiService = pointApiService;
  }

  get destinations () {
    return this.#destinations;
  }

  get offers () {
    return this.#offers;
  }

  get points () {
    return this.#points;
  }

  init = (cb) => {
    const points = this.#pointApiService.points;
    const offers = this.#pointApiService.offers;
    const destinations = this.#pointApiService.destinations;

    Promise.all([points, offers, destinations])
      .then((value) => {
        this.#points = value[0].map(this.#adaptToClient);
        this.#offers = value[1];
        this.#destinations = value[2];

        this._notify(UpdateType.INIT);
      })
      .finally(() => cb())
      .catch(() => {
        this.#offers = [];
        this.#points = [];
        this.#destinations = [];
      });
  };

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point: ${update}`);
    }

    try {
      const response = await this.#pointApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error(`Can't update point: ${update}. Error: ${err}`);
    }
  };

  addPoint = async (updateType, update) => {
    try {
      const responce = await this.#pointApiService.addPoint(update);
      const newPoint = this.#adaptToClient(responce);

      this.#points = [
        newPoint,
        ...this.#points
      ];

      this._notify(updateType, update);
    } catch(err) {
      throw new Error(`Can't add point ${update}. Error: ${err}`);
    }
  };

  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point: ${update}`);
    }

    try {
      await this.#pointApiService.deletePoint(update);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType);
    } catch(err) {
      throw new Error(`Can't delete point ${update}. Error: ${err}`);
    }

  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };

}
