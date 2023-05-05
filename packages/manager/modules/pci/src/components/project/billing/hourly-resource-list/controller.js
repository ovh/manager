import { PRODUCTS } from './constants';

export default class {
  /* @ngInject */
  constructor(DetailsPopoverService) {
    this.DetailsPopoverService = DetailsPopoverService;
    this.PRODUCTS = PRODUCTS;
  }

  $onInit() {
    this.toggle = {
      accordions: {
        instance: false,
        objectStorage: false,
        archiveStorage: false,
        coldArchive: false,
        snapshot: false,
        volume: false,
      },
    };
  }

  toggleAccordion() {
    this.DetailsPopoverService.reset();
  }
}
