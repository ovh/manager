export default class {
  /* @ngInject */
  constructor(DetailsPopoverService) {
    this.DetailsPopoverService = DetailsPopoverService;
  }

  $onInit() {
    this.toggle = {
      accordions: {
        instance: false,
        objectStorage: false,
        archiveStorage: false,
        snapshot: false,
        volume: false,
      },
    };
  }

  toggleAccordion() {
    this.DetailsPopoverService.reset();
  }
}
