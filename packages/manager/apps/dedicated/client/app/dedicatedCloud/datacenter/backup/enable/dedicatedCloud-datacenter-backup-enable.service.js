import find from 'lodash/find';

angular
  .module('App')
  .service('ovhManagerPccDatacenterBackupEnableService', class {
    /* @ngInject */
    constructor(
      OvhApiOrder,
    ) {
      this.OvhApiOrder = OvhApiOrder;
    }

    fetchBackupOffers(serviceName) {
      return this.OvhApiOrder.CartServiceOption().v6()
        .get({
          productName: 'privateCloud',
          serviceName,
        }).$promise
        .then((offers) => find(offers, { family: 'backup' }));
    }
  });
