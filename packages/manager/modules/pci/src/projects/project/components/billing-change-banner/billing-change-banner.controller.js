import { DOC_LINKS } from './billing-change-banner.constants';

export default class PciProjectActivateBannerController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
    this.DOC_LINKS = DOC_LINKS;
  }

  $onInit() {
    this.docLink =
      this.DOC_LINKS[this.coreConfig.getUser().ovhSubsidiary] ||
      this.DOC_LINKS.DEFAULT;
  }
}
