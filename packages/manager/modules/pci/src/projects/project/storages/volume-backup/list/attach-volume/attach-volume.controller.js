import { VOLUME_BACKUP_ROUTES } from '../../volume-backup.constants';

export default class VolumeBackupAttachVolumeController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, VolumeBackupService) {
    this.$translate = $translate;
    this.cucCloudMessage = CucCloudMessage;
    this.volumeBackupService = VolumeBackupService;

    this.isAttaching = false;
  }

  onAttachVolumeBackupConfirmClick() {
    this.isAttaching = true;
    return this.volumeBackupService
      .attachVolumeToInstance(
        this.projectId,
        this.volumeDetached.id,
        this.instanceDetached.id,
      )
      .then(() => {
        this.volumeDetached.attachedTo = [this.instanceDetached.id];
        return this.goBack();
      })
      .then(() => {
        return this.cucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_volume_backup_list_attach_volume_action_success',
            {
              volumeName: this.volumeDetached.name,
              instanceName: this.instanceDetached.name,
            },
          ),
          VOLUME_BACKUP_ROUTES.LIST.STATE,
        );
      })
      .catch(({ data }) => {
        return this.goToVolumeBackups(
          this.$translate.instant(
            'pci_projects_project_storages_volume_backup_list_attach_volume_action_fail',
            {
              message: data.message,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isAttaching = false;
      });
  }

  onAttachVolumeBackupCancelClick() {
    return this.goBack();
  }
}
