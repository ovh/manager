angular
  .module('managerApp')
  .filter('momentFormat', (moment) => (value, format) =>
    moment(value).format(format),
  );
