import { CLI_INSTALL_CODE } from './cli.constants';

export default class AIDashboardCliCtrl {
  /* @ngInject */
  constructor($translate, $timeout, coreConfig, atInternet) {
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.coreConfig = coreConfig;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.CLI_INSTALL_CODE = CLI_INSTALL_CODE;
  }
}
