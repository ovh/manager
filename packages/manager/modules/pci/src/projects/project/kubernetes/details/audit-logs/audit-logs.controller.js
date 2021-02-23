import { Environment } from '@ovh-ux/manager-config';
import { HTTP_STATUS, LOGS_INFO } from './audit-logs.constant';

export default class KubernetesLogsCtrl {
  /* @ngInject */
  constructor($translate, $http, TailLogs) {
    this.$translate = $translate;
    this.$http = $http;
    this.TailLogs = TailLogs;
    this.user = Environment.getUser();
  }

  $onInit() {
    this.logger = new this.TailLogs({
      source: () => {
        const url = `/cloud/project/${this.projectId}/kube/${this.kubeId}/auditLogs`;
        return this.$http.post(url).then(({ data }) => data.url);
      },
      delay: 2000,
    });

    this.startLog();
  }

  $onDestroy() {
    this.stopLog();
  }

  startLog() {
    this.logger.log();
  }

  stopLog() {
    this.logger.stop();
  }

  getLogsInfoLink() {
    return LOGS_INFO[this.user.ovhSubsidiary] || LOGS_INFO.DEFAULT;
  }

  static isWarningResponse(auditResponseStatus) {
    return (
      auditResponseStatus >= HTTP_STATUS.MIN_REDIRECTION_CODE &&
      auditResponseStatus < HTTP_STATUS.MAX_ERROR_CODE
    );
  }

  static isDangerResponse(auditResponseStatus) {
    return auditResponseStatus >= HTTP_STATUS.MIN_INTERNAL_ERROR_CODE;
  }
}
