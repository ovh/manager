import { NO_OS_INSTALLED_REGEX } from './constants';

export default class NutanixNodeGeneralInfoCtrl {
  $onInit() {
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
