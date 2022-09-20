import TripInfoPresenter from './presenter/trip-info-presenter';
import BoardPresenter from './presenter/board-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import NewPointButtonView from './view/new-point-button-view';
import { render } from './framework/render';

const mainElement = document.querySelector('.trip-main');
const tripFiltersElement = mainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const tripInfoPresenter = new TripInfoPresenter(mainElement, pointsModel);
const boardPresenter = new BoardPresenter(tripEventsElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);
const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  boardPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, mainElement);
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);

tripInfoPresenter.init();
filterPresenter.init();
boardPresenter.init();
