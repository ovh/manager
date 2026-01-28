export default class ReplicationsPromoteModalCtrl {
  /** @ngInject */
  constructor($http, $translate, Alerter) {
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.$http = $http;
    this.onLoad = false;
  }

  $onInit() {
    this.isPrimaryDisabled = !this.params.replicationID;
  }

  onError() {
    this.Alerter.error(
      this.$translate.instant('netapp_replications_promote_error', {
        sourceShareID: this.params.sourceShareID,
      }),
    );
    return this.goToReplications();
  }

  primaryAction() {
    this.$http
      .post(
        `/storage/netapp/${this.serviceName}/shareReplication/${this.params.replicationID}/cutover`,
      )
      .then(() => {
        return this.goToReplications(true).then(() => {
          this.Alerter.success(
            this.$translate.instant('netapp_replications_promote_success', {
              sourceShareID: this.params.sourceShareID,
            }),
          );
        });
      })
      .catch(() => this.onError());
  }
}
