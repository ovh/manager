angular.module('managerApp').filter('RAUnitsBits', () => {
  const tabUnits = ['B', 'KB', 'MB', 'GB', 'TB'];

  return function RAUnitsBitsFilter(size) {
    let rest = +size;
    let idx = 0;

    if (angular.isNumber(rest)) {
      while (rest / 1024 >= 1 && idx !== 4) {
        rest /= 1024;
        idx += 1;
      }

      return `${Math.ceil(rest * 100) / 100} ${tabUnits[idx]}`;
    }

    return size;
  };
});
