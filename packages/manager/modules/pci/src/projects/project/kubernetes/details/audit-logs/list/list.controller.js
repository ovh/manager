import { LOG_LIST_TRACKING_HITS } from '../audit-logs.constant';

export default class AuditLogsListCtrl {
  $onInit() {
    this.LOG_LIST_TRACKING_HITS = LOG_LIST_TRACKING_HITS;
    this.logSubscriptionApiData = {
      url: `/cloud/project/${this.projectId}/kube/${this.kubeId}/log/subscription`,
      params: {
        kind: this.kind,
      },
    };
  }
}
