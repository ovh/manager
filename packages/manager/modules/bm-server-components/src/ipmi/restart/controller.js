import isFunction from 'lodash/isFunction';

import { ALERT_SECTION } from '../constants';

export default class DedicatedServerIpmiRestartController {
  /* @ngInject */
  constructor($translate, Alerter, IpmiService) {
    this.$translate = $translate;
    this.IpmiService = IpmiService;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.loading = false;
    this.alertSection = ALERT_SECTION;
  }

  restartIpmi() {
    this.loading = true;
    return this.IpmiService.ipmiRestart(this.serviceName)
      .then(() => this.handleSuccess('server_ipmi_restart_loading'))
      .catch((error) => this.handleError(error, 'server_ipmi_restart_error'))
      .finally(() => {
        this.loading = false;
      });
  }

  handleCancel() {
    if (isFunction(this.onCancel)) {
      this.onCancel();
    }
  }

  handleError(error, translationId) {
    this.Alerter.alertFromSWS(
      this.$translate.instant(translationId),
      error.data,
      this.alertSection,
    );
    if (isFunction(this.onError)) {
      this.onError({ error });
    }
  }

  handleSuccess(translationId) {
    this.Alerter.alertFromSWS(
      this.$translate.instant(translationId),
      true,
      this.alertSection,
    );
    if (isFunction(this.onSuccess)) {
      this.onSuccess();
    }
  }
}
