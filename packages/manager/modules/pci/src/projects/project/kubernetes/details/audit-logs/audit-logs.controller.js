import { LOGS_INFO, LOG_TRACKING_HITS } from './audit-logs.constant';

export default class KubernetesLogsCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.LOG_TRACKING_HITS = LOG_TRACKING_HITS;
    this.logApiUrl = `/cloud/project/${this.projectId}/kube/${this.kubeId}/log/url`;
    this.logSubscriptionUrl = `/cloud/project/${this.projectId}/kube/${this.kubeId}/log/subscription`;
    this.logServiceGuideLink =
      LOGS_INFO[this.user.ovhSubsidiary] || LOGS_INFO.DEFAULT;
  }
}
