import { isInPast, isInFuture } from '../utils/filter';

const generateFilters = (points) => {
  const futurePoints = points.filter((point) => isInFuture(point.dateFrom));
  const pastPoints = points.filter((point) => isInPast(point.dateFrom));

  return {
    EVERYTHING: {
      name: 'everything',
      isChecked: true,
      isDisabled: Boolean(points.length === 0)
    },
    FUTURE: {
      name: 'future',
      isChecked: false,
      isDisabled: Boolean(futurePoints.length === 0)
    },
    PAST: {
      name: 'past',
      isChecked: false,
      isDisabled: Boolean(pastPoints.length === 0)
    }
  };
};

export { generateFilters };
