export default class NetAppVolumesDashboardSnapshotsDeleteController {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deleteSnapshot() {
    this.isDeleting = true;
    return this.$http
      .delete(
        `/storage/netapp/${this.serviceName}/share/${this.volumeId}/snapshot/${this.snapshot.id}`,
      )
      .then(() =>
        this.goBack(
          this.$translate.instant('netapp_volumes_snapshots_delete_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('netapp_volumes_snapshots_delete_error', {
            message: error.data?.message,
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isDeleting = false;
      });
  }
}
