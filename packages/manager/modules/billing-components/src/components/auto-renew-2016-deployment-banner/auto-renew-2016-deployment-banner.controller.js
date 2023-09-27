import { FAQ_LINK } from './auto-renew-2016-deployment-banner.constants';

export default class AutoRenew2016DeploymentBannerController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.FAQ_LINK =
      FAQ_LINK[this.coreConfig.getUser().ovhSubsidiary] || FAQ_LINK.DEFAULT;
  }
}
