angular
  .module('managerApp')
  .controller(
    'BillingMonthlyResourceListComponentCtrl',
    function BillingMonthlyResourceListComponentCtrl() {
      const self = this;
      self.toggle = {
        accordions: {
          instance: false,
        },
      };
    },
  );
