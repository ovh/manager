import { VOLUME_BACKUP_TRACKING } from '../../volume-backup.constants';

export default class VolumeBackupRestoreVolumeController {
  /* @ngInject */
  constructor($translate, VolumeBackupService) {
    this.$translate = $translate;
    this.volumeBackupService = VolumeBackupService;
  }

  $onInit() {
    this.isRestoring = false;
  }

  onRestoreVolumeClick() {
    this.trackClick(VOLUME_BACKUP_TRACKING.RESTORE_VOLUME.CTA_CONFIRM);

    this.isRestoring = true;
    return this.volumeBackupService
      .restoreVolumeBackupToVolume(
        this.projectId,
        this.volumeBackup.region,
        this.volumeBackup.id,
        this.volume.id,
      )
      .then(() => {
        this.trackPage(VOLUME_BACKUP_TRACKING.RESTORE_VOLUME.REQUEST_SUCCESS);

        return this.goToVolumeBackups({
          textHtml: this.$translate.instant(
            'pci_projects_project_storages_volume_backup_list_restore_volume_action_request_success',
            {
              volumeName: `<strong>${this.volume.name}</strong>`,
            },
          ),
        });
      })
      .then(() => this.startPolling())
      .catch(({ data }) => {
        this.trackPage(VOLUME_BACKUP_TRACKING.RESTORE_VOLUME.REQUEST_FAIL);

        return this.goToVolumeBackups(
          {
            textHtml: this.$translate.instant(
              'pci_projects_project_storages_volume_backup_list_restore_volume_action_request_error',
              {
                message: data.message,
                volumeName: `<strong>${this.volume.name}</strong>`,
              },
            ),
          },
          'error',
        );
      })
      .finally(() => {
        this.isRestoring = false;
      });
  }

  onRestoreVolumeCancelClick() {
    this.trackClick(VOLUME_BACKUP_TRACKING.RESTORE_VOLUME.CTA_CANCEL);

    return this.goBack();
  }
}
