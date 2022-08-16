import dayjs from 'dayjs';

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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

const isOfferChecked = () => Boolean(getRandomInteger(0, 1));

const findUsedOffers = (point, generatedOffers, isByType = false) => {
  let offersByType = generatedOffers;
  offersByType.filter((offer) => point.type === offer.type);

  if(isByType) {
    return offersByType[0].offers;
  }

  const getOffers = (offers) => {
    offersByType = offers.offers;
    const userOffers = offersByType.filter((offer) => point.offers.some((offerId) => offerId === offer.id));
    return userOffers;
  };

  const checkedOffers = getOffers(...offersByType);

  return checkedOffers;
};

const findDestination = (point, generatedDestinations) => {
  const rightDestination = generatedDestinations
    .filter((destination) => point.destination === destination.id);

  return rightDestination[0];
};

export {
  getRandomInteger,
  humanizePointDate,
  humanizePointTime,
  humanizeFullDate,
  durationInPoint,
  isOfferChecked,
  findUsedOffers,
  findDestination
};
