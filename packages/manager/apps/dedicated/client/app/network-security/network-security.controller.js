import { GUIDE_LINKS } from './network-security.constant';

export default class NetworkSecurityController {
  /* @ngInject */
  constructor(coreConfig, networkSecurityService) {
    this.coreConfig = coreConfig;
    this.networkSecurityService = networkSecurityService;
  }

  $onInit() {
    this.guideLink =
      GUIDE_LINKS[this.coreConfig.getUser().ovhSubsidiary] ||
      GUIDE_LINKS.DEFAULT;
  }
}
