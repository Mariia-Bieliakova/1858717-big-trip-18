import { isInPast, isInFuture } from '../utils/filter';

const generateFilters = (points) => {
  const futurePoints = points.filter((point) => isInFuture(point.dateFrom));
  const pastPoints = points.filter((point) => isInPast(point.dateTo));

  return {
    EVERYTHING: {
      name: 'everything',
      isChecked: true,
      isDisabled: points.length === 0
    },
    FUTURE: {
      name: 'future',
      isChecked: false,
      isDisabled: futurePoints.length === 0
    },
    PAST: {
      name: 'past',
      isChecked: false,
      isDisabled: pastPoints.length === 0
    }
  };
};

export { generateFilters };
