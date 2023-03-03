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
    // TODO: Tracking -- MANAGER-10570

    this.isRestoring = true;
    return this.volumeBackupService
      .restoreVolumeBackupToVolume(
        this.projectId,
        this.volumeBackup.region,
        this.volumeBackup.id,
        this.volume.id,
      )
      .then(() => {
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
    // TODO: Tracking -- MANAGER-10570

    return this.goBack();
  }
}
