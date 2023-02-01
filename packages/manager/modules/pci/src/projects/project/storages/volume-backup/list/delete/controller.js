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
        this.volumeBackup.volumeId,
      )
      .then(() => {
        return this.goToVolumeBackups(
          this.$translate.instant(
            'pci_projects_project_storages_volume_backup_list_delete_success',
          ),
        );
      })
      .then(() => this.startPolling())
      .catch(({ data }) => {
        return this.goToVolumeBackups(
          this.$translate.instant(
            'pci_projects_project_storages_volume_backup_list_delete_error',
            {
              message: data.message,
            },
          ),
          'error',
        );
      });
  }

  onDeleteVolumeBackupCancelClick() {
    // TODO: Tracking -- MANAGER-10570

    return this.goBack();
  }
}
