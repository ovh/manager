

angular.module('managerApp')
  .controller('BillingMonthlyResourceListComponentCtrl', function (DetailsPopoverService) {
    const self = this;
    self.toggle = {
      accordions: {
        instance: false,
      },
    };

    self.toggleAccordion = function () {
      DetailsPopoverService.reset();
    };
  });
