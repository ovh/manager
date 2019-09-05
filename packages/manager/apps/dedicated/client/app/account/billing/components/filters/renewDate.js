angular.module('Billing.filters').filter('renewDate', [
  function renewDateFilter() {
    function filterByExpDate(service, renew) {
      if (!service) {
        return false;
      }

      const expDate = moment(service.expiration);

      if (renew !== 'expired') {
        return expDate.subtract(1, renew) - moment() <= 0
          && !service.renew.automatic
          && !service.renew.forced;
      }
      return moment().isAfter(expDate) && !service.renew.automatic && !service.renew.forced;
    }

    return function renewDate(services, renew) {
      let output = services;
      if (renew) {
        output = services.filter((service) => {
          // Manage service groups (domain + hosting)
          if (service.subProducts) {
            if (filterByExpDate(service.subProducts.domain, renew)) {
              return true;
            }
            if (filterByExpDate(service.subProducts.hosting_web, renew)) {
              return true;
            }
          }

          return filterByExpDate(service, renew);
        });
      }

      return output;
    };
  },
]);
