import TripInfoView from '../view/trip-info-view';
import { render, RenderPosition } from '../framework/render';

export default class TripInfoPresenter {
  tripInfo = new TripInfoView();
  #infoContainer = null;

  constructor (infoContainer) {
    this.#infoContainer = infoContainer;
  }

  init = () => {
    render(this.tripInfo, this.#infoContainer, RenderPosition.AFTERBEGIN);
  };

}
