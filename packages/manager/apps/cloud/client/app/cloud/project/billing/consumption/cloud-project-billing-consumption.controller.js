angular
  .module('managerApp')
  .controller(
    'CloudProjectBillingConsumptionCtrl',
    function CloudProjectBillingConsumptionCtrl($state) {
      const self = this;

      function init() {
        self.currentDate = moment();

        $state.go('iaas.pci-project.billing.consumption.current');
      }

      self.getBillingDateInfo = function getBillingDateInfo() {
        return {
          date: self.currentDate.format('LL'),
        };
      };

      init();
    },
  );
