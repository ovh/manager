export default /* @ngInject */ function(
  ovhManagerRegionService,
  DetailsPopoverService,
) {
  const self = this;
  self.ovhManagerRegionService = ovhManagerRegionService;

  self.closePopover = function closePopover() {
    DetailsPopoverService.reset();
  };

  function init() {
    self.details = DetailsPopoverService.getCurrentDetails();
  }

  init();
}
