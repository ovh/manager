const VOLUME_OPTION_SNAPSHOT = 'SNAPSHOT';
const VOLUME_OPTION_BACKUP = 'BACKUP';
const VOLUMES_OPTIONS = [
  { id: 'volume_snapshot', type: VOLUME_OPTION_SNAPSHOT },
  { id: 'volume_backup', type: VOLUME_OPTION_BACKUP },
];

export default class VolumeBackupCreateController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, VolumeBackupService) {
    this.$translate = $translate;
    this.cucCloudMessage = CucCloudMessage;
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

    this.loadMessages();
  }

  loadMessages() {
    this.cucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.cucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  isVolumeBackupOption() {
    const { volumeOption } = this.volumeBackupModel.selected;

    return volumeOption?.type === VOLUME_OPTION_BACKUP;
  }

  isSelectedVolumeNeedToDetach() {
    const { volume } = this.volumeBackupModel.selected;

    return volume?.attachedTo.length > 0 && this.isVolumeBackupOption();
  }

  isValidConfiguration() {
    const {
      volume: selectedVolume,
      volumeOption: selectedVolumeType,
    } = this.volumeBackupModel.selected;

    return (
      selectedVolume?.attachedTo.length === 0 &&
      selectedVolumeType &&
      this.volumeBackupModel.name
    );
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

  onGoToDetachVolumeFromInstanceLinkClick() {
    // TODO: Tracking -- MANAGER-10570

    return this.goToDetachVolume(this.volumeBackupModel.selected.volume);
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
                'pci_projects_project_storages_volume_backup_create_action_create_volume_backup_fail',
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
}
