import { DEDICATED_SERVER_GUIDE } from './constants';

export default class NutanixNodeCtrl {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.user = this.coreConfig.getUser();
    this.dedicatedServerGuideUrl =
      DEDICATED_SERVER_GUIDE[this.user.ovhSubsidiary] ||
      DEDICATED_SERVER_GUIDE.DEFAULT;
  }
}
