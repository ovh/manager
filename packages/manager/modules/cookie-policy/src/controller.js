import links from './links';
import ovhImage from './assets/images/logo-ovhcloud.png';

export default class CookiePolicyController {
  /* @ngInject */
  constructor(coreConfig, $uibModalInstance) {
    this.coreConfig = coreConfig;
    this.$uibModalInstance = $uibModalInstance;
    this.ovhImage = ovhImage;
    this.locale = this.coreConfig.getUserLocale();
    this.links = links;
    this.user = this.coreConfig.getUser();
    this.currentSub = this.user.ovhSubsidiary;
    this.clickHereLink = this.links.changeOpinionLink[this.currentSub];
    this.moreInfoLink = this.links.moreInfo[this.currentSub];
  }

  accept() {
    this.$uibModalInstance.close(true);
  }

  deny() {
    this.$uibModalInstance.close(false);
  }
}
