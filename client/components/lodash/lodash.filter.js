
angular.module('managerApp').filter('lodash', () => function (model, option) {
  if (model instanceof Array) {
    return _[option.function](model, option.value);
  }

  return null;
});
