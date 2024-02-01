import { GUIDE_LINKS } from './mxplan-banner.constants';

export default class DedicatedCloudLv1Lv2MigrationBanner {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.GUIDE_LINK =
      GUIDE_LINKS[this.coreConfig.getUser().ovhSubsidiary] ||
      GUIDE_LINKS.DEFAULT;
  }
}
