

angular.module('managerApp').controller('DetailsPopoverController', function (DetailsPopoverService, CucRegionService) {
  const self = this;
  self.CucRegionService = CucRegionService;

  self.closePopover = function () {
    DetailsPopoverService.reset();
  };

  function init() {
    self.details = DetailsPopoverService.getCurrentDetails();
  }

  init();
});
