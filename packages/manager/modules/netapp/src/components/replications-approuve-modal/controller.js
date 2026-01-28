export default class ReplicationsApprouveModalCtrl {
  /** @ngInject */
  constructor($http, $translate, Alerter) {
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.$http = $http;
    this.onLoad = false;
  }

  $onInit() {
    this.isPrimaryDisabled =
      !this.params.destinationServiceID ||
      !this.params.sourceShareID ||
      !this.params.replicationID;
  }

  onError() {
    this.Alerter.error(
      this.$translate.instant('netapp_replications_approuve_error', {
        sourceShareID: this.params.sourceShareID,
      }),
    );
    return this.goToReplications();
  }

  onPrimaryClick() {
    return this.$http
      .get(
        `/storage/netapp/${this.params.destinationServiceID}/share/${this.params.sourceShareID}`,
      )
      .catch(() => this.onError())
      .then(({ data: { size } }) =>
        this.$http
          .post(
            `/storage/netapp/${this.params.destinationServiceID}/shareReplication/${this.params.replicationID}/accept`,
            {
              share: {
                protocol: 'NFS',
                size,
              },
            },
          )
          .then(() => {
            this.goToReplications(true).then(() => {
              this.Alerter.success(
                this.$translate.instant(
                  'netapp_replications_approuve_success',
                  { sourceShareID: this.params.sourceShareID },
                ),
              );
            });
          })
          .catch(() => this.onError()),
      );
  }

  primaryAction() {
    this.onLoad = true;
    this.onPrimaryClick().finally(() => {
      this.onLoad = false;
    });
  }
}
