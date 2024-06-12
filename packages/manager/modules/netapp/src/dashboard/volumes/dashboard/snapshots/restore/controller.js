import { SNAPSHOT_TYPE } from "./constants";

export default class NetAppVolumesDashboardSnapshotsRestoreController {
  /* @ngInject */
  constructor($translate, NetAppRestoreVolumeService) {
    this.$translate = $translate;
    this.NetAppRestoreVolumeService = NetAppRestoreVolumeService;
  }

  $onInit() {
    this.isLoading = true;
    this.snapshotToRevertTo = this.snapshots
      .filter((snapshot) => snapshot.type !== SNAPSHOT_TYPE.SYSTEM)
      .reduce((current, mostRecent) => current.createdAt > mostRecent.createdAt ? current : mostRecent);
    this.isLoading = false;
  }

  goBack() {
    this.trackClick('restore::cancel');
    return this.goToSnapshots();
  }

  restoreVolume() {
    this.isLoading = true;
    this.trackClick('restore::confirm');
    this.NetAppRestoreVolumeService.restoreVolume(this.serviceName, this.volumeId, this.snapshotToRevertTo)
    .then(() =>
      this.goToSnapshots(
        this.$translate.instant('netapp_volumes_snapshots_restore_success'),
      ),
    )
    .catch((error) =>
      this.goToSnapshots(
        this.$translate.instant('netapp_volumes_snapshots_restore_error', {
          message: error.data?.message,
          requestId: error.headers('X-Ovh-Queryid')
        }),
        'error',
      ),
    )
    .finally(() => {
      this.isLoading = false;
    });
  }
}
