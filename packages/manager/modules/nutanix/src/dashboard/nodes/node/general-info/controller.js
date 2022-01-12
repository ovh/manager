import { NO_OS_INSTALLED_REGEX, TRAVAUX_LINK } from './constants';

export default class NutanixNodeGeneralInfoCtrl {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.region = coreConfig.getRegion();
  }

  $onInit() {
    this.TRAVAUX_LINK = TRAVAUX_LINK;
    this.loadServer();
  }

  loadServer() {
    /* if there is no os installed, the api return "none_64" */
    if (NO_OS_INSTALLED_REGEX.test(this.server.os)) {
      this.server.os = null;
    }
  }

  showNameActions() {
    return this.region !== 'US';
  }

  getFormatedCommercialRange() {
    if (this.isHousingRange()) {
      return this.$translate.instant(
        'server_configuration_description_housing',
      );
    }
    return this.server.description || '-';
  }

  isHousingRange() {
    return this.server.commercialRange === 'housing';
  }
}
