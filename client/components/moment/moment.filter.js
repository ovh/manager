

angular.module('managerApp')
  .filter('momentFormat', moment => function (value, format) {
    return moment(value).format(format);
  });
