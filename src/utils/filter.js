import dayjs from 'dayjs';

const isInPast = (date) => dayjs().isAfter(dayjs(date));

const isInFuture = (date) => dayjs().isBefore(dayjs(date));

export {
  isInPast,
  isInFuture
};

