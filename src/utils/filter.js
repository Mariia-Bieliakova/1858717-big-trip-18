import dayjs from 'dayjs';

const isInPast = (date) => dayjs().isAfter(dayjs(date), 'day');

const isInFuture = (date) => dayjs().isBefore(dayjs(date), 'day') || dayjs().isSame(dayjs(date), 'day');

export {
  isInPast,
  isInFuture
};

