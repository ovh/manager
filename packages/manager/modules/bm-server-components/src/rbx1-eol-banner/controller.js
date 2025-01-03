import { GUIDE_LINKS } from './constants';

export default class RbxEolBannerController {
  /* @ngInject */
  constructor(coreConfig) {
    this.guideLink =
      GUIDE_LINKS[coreConfig.getUser().ovhSubsidiary] || GUIDE_LINKS.DEFAULT;
  }
}
