import TripInfoView from '../view/trip-info-view';
import { render } from '../render';

export default class TripInfoPresenter {
  tripInfo = new TripInfoView();

  init = (infoContainer) => {
    this.infoContainer = infoContainer;

    render(this.tripInfo, this.infoContainer, 'afterbegin');
  };

}
