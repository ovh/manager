import { VOLUME_BACKUP_TRACKING } from '../../volume-backup.constants';

export default class VolumeBackupDeleteController {
  /* @ngInject */
  constructor($translate, VolumeBackupService) {
    this.$translate = $translate;
    this.volumeBackupService = VolumeBackupService;

    this.DELETE_CONFIRMATION_INPUT = /^DELETE$/;
  }

  $onInit() {
    this.isDeleting = false;
  }

  onDeleteVolumeBackupClick() {
    this.trackClick(VOLUME_BACKUP_TRACKING.DELETE_BACKUP.CTA_CONFIRM);

    this.isDeleting = true;
    return this.volumeBackupService
      .deleteVolumeBackup(
        this.projectId,
        this.volumeBackup.region,
        this.volumeBackup.id,
      )
      .then(() => {
        this.trackPage(VOLUME_BACKUP_TRACKING.DELETE_BACKUP.REQUEST_SUCCESS);

        return this.goToVolumeBackups({
          textHtml: this.$translate.instant(
            'pci_projects_project_storages_volume_backup_list_delete_success',
            {
              volumeBackupName: `<strong>${this.volumeBackup.name}</strong>`,
            },
          ),
        });
      })
      .then(() => this.startPolling())
      .catch(({ data }) => {
        this.trackPage(VOLUME_BACKUP_TRACKING.DELETE_BACKUP.REQUEST_FAIL);

        return this.goToVolumeBackups(
          {
            textHtml: this.$translate.instant(
              'pci_projects_project_storages_volume_backup_list_delete_error',
              {
                volumeBackupName: `<strong>${this.volumeBackup.name}</strong>`,
                message: data.message,
              },
            ),
          },
          'error',
        );
      });
  }

  onDeleteVolumeBackupCancelClick() {
    this.trackClick(VOLUME_BACKUP_TRACKING.DELETE_BACKUP.CTA_CANCEL);

    return this.goBack();
  }
}
