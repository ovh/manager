import { NO_OS_INSTALLED_REGEX, TRAVAUX_LINK } from './constants';

export default class NutanixNodeGeneralInfoCtrl {
  /* @ngInject */
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

  openOsInstallation(type) {
    if (type === 'progress') {
      this.goToOsInstallProgress();
    } else {
      this.goToOsInstallChooseSource();
    }
  }
}
