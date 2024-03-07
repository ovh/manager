export default class AuditLogsListCtrl {
  $onInit() {
    this.logSubscriptionApiData = {
      url: `/cloud/project/${this.projectId}/kube/${this.kubeId}/log/subscription`,
      params: {
        kind: this.kind,
      },
    };
  }
}
