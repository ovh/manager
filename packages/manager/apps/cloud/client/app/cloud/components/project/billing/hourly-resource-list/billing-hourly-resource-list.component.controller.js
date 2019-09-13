angular.module('managerApp')
  .controller('BillingHourlyResourceListComponentCtrl', function () {
    const self = this;
    self.toggle = {
      accordions: {
        instance: false,
        objectStorage: false,
        archiveStorage: false,
        snapshot: false,
        volume: false,
        additionalServices: false,
        outgoingTraffic: false,
      },
    };
  });
