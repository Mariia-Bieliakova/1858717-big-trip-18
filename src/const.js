import dayjs from 'dayjs';

const TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DESTINATION = ['Amsterdam', 'Geneva', 'Chamonix'];

const NoPointMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  FUTURE: 'There are no future events now'
};

const SortType = {
  DEFAULT: 'day',
  PRICE: 'price',
  DURATION: 'time'
};

const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PAST: 'PAST'
};

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  destination: 0,
  isFavorite: false,
  offers: [],
  type: TYPE[0]
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const FormType = {
  EDITING: 'EDITING',
  CREATING: 'CREARING'
};

export {
  TYPE,
  DESTINATION,
  NoPointMessage,
  SortType,
  BLANK_POINT,
  UserAction,
  UpdateType,
  FilterType,
  FormType
};
