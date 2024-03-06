export default class AuditLogsListCtrl {
  $onInit() {
    this.logSubscriptionUrl = `/cloud/project/${this.projectId}/kube/${this.kubeId}/log/subscription`;
  }
}
