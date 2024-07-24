import { GUIDE_LINK, IMMINENT_LINK } from './rbx-eol-banner.constants';

export default class RbxEolBannerController {
  /* @ngInject */
  constructor(coreConfig) {
    this.userSubsidiary = coreConfig.getUser().ovhSubsidiary;
  }

  $onInit() {
    this.IMMINENT_LINK =
      IMMINENT_LINK[this.userSubsidiary] || IMMINENT_LINK.DEFAULT;
    this.GUIDE_LINK = GUIDE_LINK[this.userSubsidiary] || GUIDE_LINK.DEFAULT;
  }
}
