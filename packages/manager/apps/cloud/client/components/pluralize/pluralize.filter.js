import defaults from 'lodash/defaults';

angular.module('managerApp').filter('pluralize', ($translate, $log) => {
  const exist = (translateId) =>
    $translate.instant(translateId) !== translateId;

  const validateId = (id) => (exist(id) ? id : undefined);

  return (translateId, counterParam, vars) => {
    let key;
    let counter = counterParam;

    counter = parseFloat(counter);

    if (angular.isNumber(counter)) {
      key = validateId([translateId, counter].join('_'));

      if (!key) {
        switch (counter) {
          case 0:
            key = validateId([translateId, 'zero'].join('_'));
            break;

          case 1:
            key = validateId([translateId, 'one'].join('_'));
            break;

          default:
            key = validateId([translateId, 'other'].join('_'));
        }
      }
    } else {
      $log.warn('[pluralize] counter must be a number! (%o)', counter);
    }

    defaults(vars, { count: counter });

    return $translate.instant(key || translateId, vars || {});
  };
});
