import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

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

const BLANK_POINT = {
  id: nanoid(),
  basePrice: 0,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  destination: 2,
  isFavorite: false,
  offers: [],
  type: ''
};

export {
  TYPE,
  DESTINATION,
  NoPointMessage,
  SortType,
  BLANK_POINT
};
