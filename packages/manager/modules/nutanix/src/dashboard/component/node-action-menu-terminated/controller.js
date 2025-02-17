import { HELP_LINK } from './constants';

export default class NutanixDashboardNodeActionMenuResiliated {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    const { ovhSubsidiary } = this.coreConfig.getUser();

    this.contactUsUrl = HELP_LINK[ovhSubsidiary] || HELP_LINK.DEFAULT;
  }
}
