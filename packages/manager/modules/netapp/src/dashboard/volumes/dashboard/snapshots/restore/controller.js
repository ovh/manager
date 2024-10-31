import { SNAPSHOT_TYPE } from '../constants';
import { SNAPSHOT_STATUS } from './constants';

export default class NetAppVolumesDashboardSnapshotsRestoreController {
  /* @ngInject */
  constructor($translate, NetAppSnapshotService, coreConfig) {
    this.$translate = $translate;
    this.language = coreConfig.getUserLocale().replace('_', '-');
    this.NetAppSnapshotService = NetAppSnapshotService;
  }

  $onInit() {
    this.isLoading = true;
    if (!this.hasOnlySystemSnapshot) {
      this.snapshotToRevertTo = this.snapshots
        .filter((snapshot) => snapshot.type !== SNAPSHOT_TYPE.SYSTEM)
        .reduce((current, mostRecent) =>
          current.createdAt > mostRecent.createdAt ? current : mostRecent,
        );

      this.snapshotToRevertTo.formattedCreationDate = new Intl.DateTimeFormat(
        this.language,
        {
          dateStyle: 'full',
          timeStyle: 'long',
        },
      ).format(new Date(this.snapshotToRevertTo.createdAt));
    }
    this.isLoading = false;
  }

  goBack() {
    this.trackClick('restore::cancel');
    return this.goToSnapshots();
  }

  validateVolumeName() {
    this.volumeNameValidated =
      this.volumeName === this.volume.name || this.volumeName === this.volumeId;
  }

  restoreVolume() {
    this.isLoading = true;
    this.trackClick('restore::confirm');
    this.NetAppSnapshotService.restoreVolume(
      this.serviceName,
      this.volumeId,
      this.snapshotToRevertTo,
    )
      .then(() =>
        this.goToSnapshots(
          this.$translate.instant('netapp_volumes_snapshots_restore_success'),
        ),
      )
      .catch((error) => {
        const message =
          error.status === SNAPSHOT_STATUS.MANAGE_ERROR
            ? this.$translate.instant('netapp_volumes_snapshots_hold_error')
            : error.data?.message;
        return this.goToSnapshots(
          this.$translate.instant('netapp_volumes_snapshots_restore_error', {
            message,
            requestId: error.headers?.('X-Ovh-Queryid') || null,
          }),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
