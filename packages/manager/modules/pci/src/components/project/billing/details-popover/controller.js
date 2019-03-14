

export default /* @ngInject */ function (
  DetailsPopoverService,
  CucRegionService,
) {
  const self = this;
  self.CucRegionService = CucRegionService;

  self.closePopover = function closePopover() {
    DetailsPopoverService.reset();
  };

  function init() {
    self.details = DetailsPopoverService.getCurrentDetails();
  }

  init();
}
