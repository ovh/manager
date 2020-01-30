import angular from 'angular';

export default () => {
  const tabUnits = ['B', 'KB', 'MB', 'GB', 'TB'];

  return function filter(size) {
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
};
