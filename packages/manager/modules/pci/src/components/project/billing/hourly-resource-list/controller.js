
export default /* @ngInject */ function (
  DetailsPopoverService,
) {
  const self = this;

  self.toggle = {
    accordions: {
      instance: false,
      objectStorage: false,
      archiveStorage: false,
      snapshot: false,
      volume: false,
    },
  };

  self.toggleAccordion = function toggleAccordion() {
    DetailsPopoverService.reset();
  };
}
