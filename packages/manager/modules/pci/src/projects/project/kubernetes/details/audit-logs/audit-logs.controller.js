import { LOG_KEYS, LOGS_INFO } from './audit-logs.constant';

export default class KubernetesLogsCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    this.LOG_KEYS = LOG_KEYS;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.logKindApiUrl = `/cloud/project/${this.projectId}/capabilities/kube/log/kind`;
    this.logApiUrl = `/cloud/project/${this.projectId}/kube/${this.kubeId}/log/url`;
    this.logServiceGuideLink =
      LOGS_INFO[this.user.ovhSubsidiary] || LOGS_INFO.DEFAULT;
    this.logSubscriptionUrl = `/cloud/project/${this.projectId}/kube/${this.kubeId}/log/subscription`;
  }
}
