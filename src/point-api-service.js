import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT'
};

export default class PointApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  updatePoint = async (point) => {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponce = await ApiService.parseResponse(response);

    return parsedResponce;
  };

  #adaptToServer = (point) => {
    const adaptedPoint = {...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom.toISOString(),
      'date_to': point.dateTo.toISOString(),
      'is_favorite': point.isFavorite
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  };
}
