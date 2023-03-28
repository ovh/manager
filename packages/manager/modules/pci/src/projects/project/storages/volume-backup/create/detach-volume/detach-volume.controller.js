import { VOLUME_BACKUP_ROUTES } from '../../volume-backup.constants';

export default class VolumeBackupDetachVolumeController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, VolumeBackupService) {
    this.$translate = $translate;
    this.cucCloudMessage = CucCloudMessage;
    this.volumeBackupService = VolumeBackupService;

    this.isDetaching = false;
  }

  getTitle() {
    return this.$translate.instant(
      'pci_projects_project_storages_volume_backup_create_detach_volume_title',
      { volumeName: this.volume.name, instanceName: this.instance.name },
    );
  }

  onDetachVolumeBackupDetachClick() {
    // TODO: Tracking -- MANAGER-10570

    this.isDetaching = true;
    return this.volumeBackupService
      .detachVolumeFromInstance(
        this.projectId,
        this.volume.id,
        this.instance.id,
      )
      .then(() => {
        this.volume.attachedTo = [];
        return this.goBack();
      })
      .then(() => {
        return this.cucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_volume_backup_create_detach_volume_action_success',
            { volumeName: this.volume.name, instanceName: this.instance.name },
          ),
          VOLUME_BACKUP_ROUTES.CREATE.STATE,
        );
      })
      .catch(({ data }) => {
        return this.goToVolumeBackups(
          this.$translate.instant(
            'pci_projects_project_storages_volume_backup_create_detach_volume_action_fail',
            {
              message: data.message,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isDetaching = false;
      });
  }

  onDetachVolumeBackupCancelClick() {
    // TODO: Tracking -- MANAGER-10570

    return this.goBack();
  }
}
