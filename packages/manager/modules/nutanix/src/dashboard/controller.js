import { GUIDE_URL } from './constants';

export default class NutanixDashboardCtrl {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.nutanixGuideUrl =
      GUIDE_URL.ALL_GUIDE[this.user.ovhSubsidiary] ||
      GUIDE_URL.ALL_GUIDE.DEFAULT;
  }
}
