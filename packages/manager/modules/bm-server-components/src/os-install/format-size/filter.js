import {
  UNITS,
} from './constants';

export default /* @ngInject */ ($translate) => {
  return function formatSizeFilter(
    octetsSize,
    unitIndex = 0,
  ) {
    if (!Number.isNaN(octetsSize)) {
      if (octetsSize >= 1000 && unitIndex < UNITS.model.length - 1) {
        return formatSizeFilter(octetsSize / 1000, unitIndex + 1);
      }
      return `${parseFloat(octetsSize).toFixed(1)} ${$translate.instant(
        `unit_size_${UNITS.model[unitIndex].label}`,
      )}`;
    }
    return '';
  };
};
