import dayjs from 'dayjs';
import { FilterType } from '../const';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const filterPoints = (filterType, points) => {
  const futurePoints = points.filter((point) => dayjs().isSameOrBefore(dayjs(point.dateTo), 'day'));
  const pastPoints = points.filter((point) => dayjs().isAfter(dayjs(point.dateFrom), 'day'));

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return futurePoints;
    case FilterType.PAST:
      return pastPoints;
    default:
      throw new Error(`Unknown filter type: ${filterType}`);
  }
};

export {
  filterPoints
};

