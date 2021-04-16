import { Environment } from '@ovh-ux/manager-config';
import links from './links';
import ovhImage from './assets/images/logo-ovhcloud.png';

export default class CookiePolicyController {
  /* @ngInject */
  constructor($uibModalInstance) {
    this.$uibModalInstance = $uibModalInstance;
    this.ovhImage = ovhImage;
    this.locale = Environment.getUserLocale();
    this.links = links;
    this.user = Environment.getUser();
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
