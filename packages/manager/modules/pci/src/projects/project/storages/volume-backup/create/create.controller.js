const VOLUME_OPTION_SNAPSHOT = 'SNAPSHOT';
const VOLUME_OPTION_BACKUP = 'BACKUP';
const VOLUMES_OPTIONS = [
  { id: 'volume_snapshot', type: VOLUME_OPTION_SNAPSHOT },
  { id: 'volume_backup', type: VOLUME_OPTION_BACKUP },
];

export default class VolumeBackupCreateController {
  /* @ngInject */
  constructor($translate, VolumeBackupService) {
    this.$translate = $translate;
    this.volumeBackupService = VolumeBackupService;
  }

  $onInit() {
    this.VOLUMES_OPTIONS = VOLUMES_OPTIONS;

    this.isCreating = false;
    this.volumeBackupModel = {
      selected: {
        volume: null,
        volumeOption: null,
      },
      name: '',
    };
  }

  isVolumeBackupOption() {
    const { volumeOption } = this.volumeBackupModel.selected;

    return volumeOption?.type === VOLUME_OPTION_BACKUP;
  }

  isSelectableVolumeOption() {
    const { volume } = this.volumeBackupModel.selected;

    return (
      (volume && !this.isVolumeBackupOption()) ||
      (this.isVolumeBackupOption() && volume?.attachedTo?.length === 0)
    );
  }

  isValidConfiguration() {
    const {
      volume: selectedVolume,
      volumeOption: selectedVolumeType,
    } = this.volumeBackupModel.selected;

    return selectedVolume && selectedVolumeType && this.volumeBackupModel.name;
  }

  createVolumeSnapshot() {
    const { name } = this.volumeBackupModel;
    const { volume } = this.volumeBackupModel.selected;

    return this.volumeBackupService
      .createVolumeSnapshot(this.projectId, volume.id, { name })
      .then(() => {
        return this.goToVolumeBackups(
          this.$translate.instant(
            'pci_projects_project_storages_volume_backup_create_action_create_option_volume_snapshot_success',
            {
              backupName: this.volumeBackupModel.name,
            },
          ),
        );
      });
  }

  createVolumeBackup() {
    const { name } = this.volumeBackupModel;
    const { volume } = this.volumeBackupModel.selected;

    return this.volumeBackupService
      .createVolumeBackup(this.projectId, volume.region, {
        name,
        volumeId: volume.id,
      })
      .then(() => {
        return this.goToVolumeBackups(
          this.$translate.instant(
            'pci_projects_project_storages_volume_backup_create_action_create_option_volume_backup_success',
            {
              backupName: this.volumeBackupModel.name,
            },
          ),
        );
      });
  }

  onCreateBackupClick() {
    // TODO: Tracking -- MANAGER-10570

    this.isCreating = true;
    return this.isVolumeBackupOption()
      ? this.createVolumeBackup()
      : this.createVolumeSnapshot()
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
          })
          .finally(() => {
            this.isCreating = false;
          });
  }

  onCreateVolumeBackupCancelClick() {
    // TODO: Tracking -- MANAGER-10570

    return this.goBack();
  }
}
