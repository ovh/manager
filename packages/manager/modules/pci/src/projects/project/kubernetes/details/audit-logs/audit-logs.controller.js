import { LOGS_INFO } from './audit-logs.constant';

export default class KubernetesLogsCtrl {
  /* @ngInject */
  constructor(coreConfig, $translate) {
    this.user = coreConfig.getUser();
    this.$translate = $translate;
  }

  $onInit() {
    this.logApiUrl = `/cloud/project/${this.projectId}/kube/${this.kubeId}/log/url`;
    this.logSubscriptionUrl = `/cloud/project/${this.projectId}/kube/${this.kubeId}/log/subscription`;
    this.logServiceGuideLink =
      LOGS_INFO[this.user.ovhSubsidiary] || LOGS_INFO.DEFAULT;
    this.logsDescription = this.$translate.instant('logs_main_description');
  }
}
