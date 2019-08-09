angular.module('Billing.filters').filter('orderRenew', ($translate, $filter) => {
  function translateRenewforCompare(value) {
    if (value.automatic || value.forced) {
      return $translate.instant('autorenew_service_renew_auto') + (value.period ? $filter('renewFrequence')(value.period) : '');
    } if (!value.automatic && !value.forced) {
      return $translate.instant('autorenew_service_renew_manuel');
    }
    return value;
  }

  return function (services, predicate, reverse) {
    let output = services;

    if (predicate === 'serviceId') {
      output = $filter('orderBy')(output, predicate, reverse);
    } else {
      services.sort((a, b) => {
        let result;

        switch (predicate) {
          case 'expiration':
            result = (reverse ? -1 : 1) * (moment(a[predicate]) - moment(b[predicate]));
            if (Number.isNaN(result)) {
              result = reverse ? Number.MIN_VALUE : Number.MAX_VALUE;
            }
            break;
          case 'renew':
            result = (reverse ? -1 : 1) * translateRenewforCompare(a[predicate])
              .localeCompare(translateRenewforCompare(b[predicate]));
            break;
          default:
            break;
        }

        return result;
      });
    }

    return output;
  };
});
