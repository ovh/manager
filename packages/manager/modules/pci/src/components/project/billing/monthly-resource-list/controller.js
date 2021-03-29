export default /* @ngInject */ function (DetailsPopoverService) {
  const self = this;
  self.toggle = {
    accordions: {
      instance: false,
    },
  };

  self.toggleAccordion = function toggleAccordion() {
    DetailsPopoverService.reset();
  };
}
