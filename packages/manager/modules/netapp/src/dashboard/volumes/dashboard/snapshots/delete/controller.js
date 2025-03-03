import {
  SNAPSHOT_TRACKING_PREFIX,
  SNAPSHOT_LISTING_TRACKING_CONTEXT,
} from '../constants';

export default class NetAppVolumesDashboardSnapshotsDeleteController {
  /* @ngInject */
  constructor($http, $translate, atInternet) {
    this.$http = $http;
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.isDeleting = false;
    this.atInternet.trackPage({
      name: `${SNAPSHOT_TRACKING_PREFIX}netapp::pop-up::delete::snapshot`,
      ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
    });
  }

  deleteSnapshot() {
    this.isDeleting = true;
    this.trackClick('delete_snapshot::confirm');
    return this.$http
      .delete(
        `/storage/netapp/${this.serviceName}/share/${this.volumeId}/snapshot/${this.snapshot.id}`,
      )
      .then(() =>
        this.goToSnapshots(
          this.$translate.instant('netapp_volumes_snapshots_delete_success'),
        ),
      )
      .catch((error) =>
        this.goToSnapshots(
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

  goBack() {
    this.trackClick('delete_snapshot::cancel');
    return this.goToSnapshots();
  }
}
