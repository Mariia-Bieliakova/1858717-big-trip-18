import FiltersView from './view/filters-view';
import TripInfoPresenter from './presenter/trip-info-presenter';
import BoardPresenter from './presenter/board-presenter';
import PointsModel from './model/points-model';
import { render } from './framework/render';

const mainElement = document.querySelector('.trip-main');
const tripFiltersElement = mainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const tripInfoPresenter = new TripInfoPresenter(mainElement);
const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter(tripEventsElement, pointsModel);

tripInfoPresenter.init();
render(new FiltersView(), tripFiltersElement);
boardPresenter.init();
