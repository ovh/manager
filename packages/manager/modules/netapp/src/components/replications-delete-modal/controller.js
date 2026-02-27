import { REPLICATION_API_STATUS } from '../../dashboard/replications/constants';

export default class ReplicationsDeleteModalCtrl {
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

  getTitle() {
    if (
      [
        REPLICATION_API_STATUS.pending,
        REPLICATION_API_STATUS.accepted,
      ].includes(this.params.status)
    ) {
      return this.$translate.instant(
        'netapp_replications_modal_delete_title_cancel',
      );
    }
    return this.$translate.instant(
      'netapp_replications_modal_delete_title_delete',
    );
  }

  getDescription() {
    switch (this.params.status) {
      case REPLICATION_API_STATUS.pending:
        return this.$translate.instant(
          'netapp_replications_modal_delete_description_pending',
        );
      case REPLICATION_API_STATUS.completed:
        return this.$translate.instant(
          'netapp_replications_modal_delete_description_completed',
        );
      case REPLICATION_API_STATUS.accepted:
        return this.$translate.instant(
          'netapp_replications_modal_delete_description_accepted',
        );
      default:
        return this.$translate.instant(
          'netapp_replications_modal_delete_description_delete',
        );
    }
  }

  onError() {
    this.Alerter.error(
      [
        REPLICATION_API_STATUS.pending,
        REPLICATION_API_STATUS.accepted,
      ].includes(this.params.status)
        ? this.$translate.instant('netapp_replications_cancel_error', {
            sourceShareID: this.params.sourceShareID,
          })
        : this.$translate.instant('netapp_replications_delete_error', {
            sourceShareID: this.params.sourceShareID,
          }),
    );
    return this.goToReplications();
  }

  primaryAction() {
    this.$http
      .delete(
        `/storage/netapp/${this.serviceName}/shareReplication/${this.params.replicationID}`,
      )
      .then(() => {
        return this.goToReplications(true).then(() => {
          this.Alerter.success(
            [
              REPLICATION_API_STATUS.pending,
              REPLICATION_API_STATUS.accepted,
            ].includes(this.params.status)
              ? this.$translate.instant('netapp_replications_cancel_success', {
                  sourceShareID: this.params.sourceShareID,
                })
              : this.$translate.instant('netapp_replications_delete_success', {
                  sourceShareID: this.params.sourceShareID,
                }),
          );
        });
      })
      .catch(() => this.onError());
  }
}
