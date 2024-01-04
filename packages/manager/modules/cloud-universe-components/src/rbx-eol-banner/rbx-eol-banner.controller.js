import { GUIDE_LINK } from './rbx-eol-banner.constants';

export default class RbxEolBannerController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.GUIDE_LINK =
      GUIDE_LINK[this.coreConfig.getUser().ovhSubsidiary] || GUIDE_LINK.DEFAULT;
  }
}
