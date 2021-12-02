import { PATTERN } from './constants';

export default class NetAppVolumesDashboardSnapshotsEditController {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
    this.PATTERN = PATTERN;
  }

  $onInit() {
    this.isLoading = false;
    const { id, name, description } = this.snapshot;
    this.id = id;
    this.name = name;
    this.description = description;
  }

  editSnapshot() {
    this.isLoading = true;
    this.trackClick('edit::confirm');
    return this.$http
      .put(
        `/storage/netapp/${this.serviceName}/share/${this.volumeId}/snapshot/${this.id}`,
        {
          name: this.name,
          description: this.description,
        },
      )
      .then(() =>
        this.goToSnapshots(
          this.$translate.instant('netapp_volumes_snapshots_edit_success'),
        ),
      )
      .catch((error) =>
        this.goToSnapshots(
          this.$translate.instant('netapp_volumes_snapshots_edit_error', {
            message: error.data?.message,
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  goBack() {
    this.trackClick('edit::cancel');
    return this.goToSnapshots();
  }
}
