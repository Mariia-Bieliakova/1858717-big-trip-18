import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const isInPast = (date) => dayjs().isAfter(dayjs(date), 'day');

const isInFuture = (date) => dayjs().isSameOrBefore(dayjs(date), 'day');

export {
  isInPast,
  isInFuture
};

