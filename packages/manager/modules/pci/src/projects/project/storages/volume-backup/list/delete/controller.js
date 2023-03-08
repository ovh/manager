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
    // TODO: Tracking -- MANAGER-10570

    this.isDeleting = true;
    return this.volumeBackupService
      .deleteVolumeBackup(
        this.projectId,
        this.volumeBackup.region,
        this.volumeBackup.id,
      )
      .then(() => {
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
    // TODO: Tracking -- MANAGER-10570

    return this.goBack();
  }
}
