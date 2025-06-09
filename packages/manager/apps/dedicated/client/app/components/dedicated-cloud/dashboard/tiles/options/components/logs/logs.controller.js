import {
  COMPATIBILITY_MATRIX_LOGS_NAME,
  LOGS_COMPATIBILITY_STATE,
  LOGS_ACTIONS,
} from './logs.constants';

export default class OptionsLogsCtrl {
  /* @ngInject */
  constructor($translate, logsService, coreURLBuilder, Alerter) {
    this.logsService = logsService;
    this.coreURLBuilder = coreURLBuilder;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.LOGS_COMPATIBILITY_STATE = LOGS_COMPATIBILITY_STATE;
    this.LOGS_ACTIONS = LOGS_ACTIONS;
  }

  $onInit() {
    this.getLogCompatibility();

    this.logsUrl = this.coreURLBuilder.buildURL(
      'hpc-vmware-vsphere',
      `#/${this.currentService.name}/logs`,
    );
  }

  getLogCompatibility() {
    this.loading = true;
    this.logsService
      .getCompatibilityMatrix(this.currentService.name)
      .then((compatiblityMatrix) => {
        this.logsCompatiblity = compatiblityMatrix.find(
          (option) => option.name === COMPATIBILITY_MATRIX_LOGS_NAME,
        );
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('logs_get_status_error', {
            error: error.data?.message || error.message || error,
          }),
          'dedicatedCloud',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
