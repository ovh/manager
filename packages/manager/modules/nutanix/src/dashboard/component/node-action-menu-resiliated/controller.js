import { CONTACT_US_LINK } from './constants';

export default class NutanixDashboardNodeActionMenuResiliated {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    const { ovhSubsidiary } = this.coreConfig.getUser();

    this.contactUsUrl =
      CONTACT_US_LINK[ovhSubsidiary] || CONTACT_US_LINK.DEFAULT;
  }
}
