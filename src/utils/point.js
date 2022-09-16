import dayjs from 'dayjs';

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

const humanizePointDate = (date) => dayjs(date).format('MMM D');

const humanizePointTime = (date) => dayjs(date).format('HH:mm');

const humanizeFullDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const setNumberInFormat = (number) => number.toString().padStart(2,0);

const durationInPoint = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const finish = dayjs(dateTo);
  const differenceInDays = finish.diff(start, 'd');
  let differenceInHours = finish.diff(start, 'h');
  let differenceInMinute = finish.diff(start, 'm');

  if (differenceInDays > 0) {
    differenceInHours -= differenceInDays * HOURS_IN_DAY;
    differenceInMinute -= (differenceInHours * MINUTES_IN_HOUR + (differenceInDays * HOURS_IN_DAY) * MINUTES_IN_HOUR);

    return `${setNumberInFormat(differenceInDays)}D ${setNumberInFormat(differenceInHours)}H ${setNumberInFormat(differenceInMinute)}M`;
  }
  if (differenceInHours > 0) {
    differenceInMinute -= (differenceInHours * MINUTES_IN_HOUR);
    return `${setNumberInFormat(differenceInHours)}H ${setNumberInFormat(differenceInMinute)}M`;
  }

  return `${setNumberInFormat(differenceInMinute)}M`;
};

const isOfferChecked = (offer, point) =>
  point.offers.some((userOffer) => userOffer === offer.id);

const findSelectedOffers = (point, generatedOffers) => {
  const offersByType = generatedOffers
    .find((offer) => point.type === offer.type);

  if (!offersByType.offers) {
    return;
  }

  return offersByType.offers.filter((offer) =>
    point.offers
      .some((offerId) => offerId === offer.id));
};

const findDestination = (point, destinations) => destinations
  .find((destination) => point.destination === destination.id);

const sortByDate = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortByDuration = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return durationB - durationA;
};

export {
  humanizePointDate,
  humanizePointTime,
  humanizeFullDate,
  durationInPoint,
  isOfferChecked,
  findSelectedOffers,
  findDestination,
  sortByDate,
  sortByDuration,
  sortByPrice
};
