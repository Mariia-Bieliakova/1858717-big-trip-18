import SortingView from '../view/sorting-view';
import TripPointsListView from '../view/trip-points-list-view';
import EditFormView from '../view/edit-form-view';
import TripPointView from '../view/trip-point-view';
import { render } from '../render';

export default class BoardPresenter {
  listComponent = new TripPointsListView();

  init = (boardContainer, pointsModel) => {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
    this.boardPoints = [...this.pointsModel.getPoints()];
    this.boardOffers = [...this.pointsModel.getOffers()];
    render(new SortingView(), this.boardContainer);
    render(this.listComponent, this.boardContainer);
    render(new EditFormView(this.boardPoints[0], this.boardOffers), this.listComponent.getElement());

    for (let i = 0; i < 5; i++) {
      render(new TripPointView(this.boardPoints[i]), this.listComponent.getElement());
    }
  };
}
