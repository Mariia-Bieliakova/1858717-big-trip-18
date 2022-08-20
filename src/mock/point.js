import { getRandomInteger } from '../util';
import dayjs from 'dayjs';

const generateDate = () => {
  const maxDaysGap = 2000;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'm').toDate();
};

export const generatePoint = () => {
  const dateFrom = generateDate();
  let dateTo = generateDate();

  while (dateTo <= dateFrom) {
    dateTo = generateDate();
  }

  return {
    basePrice: getRandomInteger(30, 300),
    dateFrom: dateFrom,
    dateTo: dateTo,
    destination: 2,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: [1, 3],
    type: 'taxi'
  };
};
