export default class NetAppVolumesDashboardSnapshotsAddController {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
  }

  $onInit() {
    this.isLoading = false;
  }

  addSnapshot() {
    this.isLoading = true;
    this.trackClick('create::confirm');
    return this.$http
      .post(
        `/storage/netapp/${this.serviceName}/share/${this.volumeId}/snapshot`,
        {
          name: this.name,
          description: this.description,
        },
      )
      .then(() =>
        this.goBack(
          this.$translate.instant('netapp_volumes_snapshots_add_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('netapp_volumes_snapshots_add_error', {
            message: error.data?.message,
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
