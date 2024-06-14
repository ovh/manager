import { SNAPSHOT_STATUS, SNAPSHOT_TYPE } from "./constants";

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

  validateVolumeName() {
    this.volumeNameValidated =
      (this.volumeName === this.volume.name) || (this.volumeName === this.volumeId);
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
    .catch((error) => {
      const message = error.status === SNAPSHOT_STATUS.MANAGE_ERROR
        ? this.$translate.instant('netapp_volumes_snapshots_hold_error')
        : error.data?.message;
      return this.goToSnapshots(
        this.$translate.instant('netapp_volumes_snapshots_restore_error', {
          message,
          requestId: error.headers?.('X-Ovh-Queryid') || null
        }),
        'error',
      );
    })
    .finally(() => {
      this.isLoading = false;
    });
  }
}
