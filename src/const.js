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
  INIT: 'INIT',
  INIT_ERROR: 'INIT ERROR'
};

const FormType = {
  EDITING: 'EDITING',
  CREATING: 'CREARING'
};

const ApiData = {
  END_POINT: 'https://18.ecmascript.pages.academy/big-trip',
  AUTHORIZATION: 'Basic sjdhfksjdcnkjsdh'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

const PointMode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
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
  FormType,
  ApiData,
  TimeLimit,
  Method,
  PointMode
};
