import { LOGS_INFO, LOG_KEYS } from './audit-logs.constant';

export default class KubernetesLogsCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    this.user = coreConfig.getUser();
    this.LOG_KEYS = LOG_KEYS;
  }

  $onInit() {
    this.logKindApiUrl = `/cloud/project/${this.projectId}/capabilities/kube/log/kind`;
    this.logApiUrl = `/cloud/project/${this.projectId}/kube/${this.kubeId}/log/url`;
  }

  getLogsInfoLink() {
    return LOGS_INFO[this.user.ovhSubsidiary] || LOGS_INFO.DEFAULT;
  }
}
