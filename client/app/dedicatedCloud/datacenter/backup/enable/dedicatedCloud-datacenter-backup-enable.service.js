import _ from 'lodash';

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
        .then(offers => _.find(offers, { family: 'backup' }));
    }
  });
