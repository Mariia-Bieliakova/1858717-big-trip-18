import SortingView from '../view/sorting-view';
import TripPointsListView from '../view/trip-points-list-view';
import EditFormView from '../view/edit-form-view';
import TripPointView from '../view/trip-point-view';
import { render } from '../render';

export default class BoardPresenter {
  listComponent = new TripPointsListView();

  init = (boardContainer) => {
    this.boardContainer = boardContainer;

    render(new SortingView(), this.boardContainer);
    render(this.listComponent, this.boardContainer);
    render(new EditFormView(), this.listComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new TripPointView(), this.listComponent.getElement());
    }
  };
}
