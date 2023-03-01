import {
  VOLUME_OPTION_BACKUP,
  VOLUME_OPTION_SNAPSHOT,
  VOLUMES_OPTIONS,
} from './create.constants';

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

  isVolumeSnapshotOption() {
    const { volumeOption } = this.volumeBackupModel.selected;

    return volumeOption?.type === VOLUME_OPTION_SNAPSHOT;
  }

  isSelectedVolumeNeedToDetach() {
    const { volume } = this.volumeBackupModel.selected;

    return volume?.attachedTo.length > 0 && this.isVolumeBackupOption();
  }

  isValidConfiguration() {
    const { volume: selectedVolume } = this.volumeBackupModel.selected;

    return (
      selectedVolume &&
      this.volumeBackupModel.name &&
      (this.isVolumeSnapshotOption() ||
        (this.isVolumeBackupOption() &&
          selectedVolume?.attachedTo.length === 0))
    );
  }

  buildAttachVolumeToInstanceCucMessage(backupName, volumeName) {
    const msgPart1 = this.$translate.instant(
      'pci_projects_project_storages_volume_backup_create_action_create_option_volume_backup_success_part_1',
      {
        backupName: `<strong>${backupName}</strong>`,
      },
    );
    const msgPart2 = this.$translate.instant(
      'pci_projects_project_storages_volume_backup_create_action_create_option_volume_backup_success_part_2',
      {
        volumeName: `<strong>${volumeName}</strong>`,
      },
    );

    return {
      textHtml: `${msgPart1} <br /> ${msgPart2}`,
    };
  }

  createVolumeSnapshot() {
    const { name, volumeRelatedInstance } = this.volumeBackupModel;
    const { volume } = this.volumeBackupModel.selected;

    return this.volumeBackupService
      .createVolumeSnapshot(this.projectId, volume.id, { name })
      .then(() => {
        return this.goToSnapshots({
          cucCloudParams: {
            message: this.buildAttachVolumeToInstanceCucMessage(
              name,
              volume.name,
            ),
            type: 'success',
          },
          taskParams: {
            volumeDetached: volume,
            instanceDetached: volumeRelatedInstance,
          },
        });
      })
      .catch(({ data }) => {
        return this.goToSnapshots({
          cucCloudParams: {
            message: this.$translate.instant(
              'pci_projects_project_storages_volume_backup_create_action_create_volume_backup_fail',
              {
                message: data.message,
              },
            ),
            type: 'error',
          },
        });
      });
  }

  createVolumeBackup() {
    const { name, volumeRelatedInstance } = this.volumeBackupModel;
    const { volume } = this.volumeBackupModel.selected;

    return this.volumeBackupService
      .createVolumeBackup(this.projectId, volume.region, {
        name,
        volumeId: volume.id,
      })
      .then(() => {
        return this.goToVolumeBlockStorage({
          cucCloudParams: {
            message: this.buildAttachVolumeToInstanceCucMessage(
              name,
              volume.name,
            ),
            type: 'success',
          },
          taskParams: {
            volumeDetached: volume,
            instanceDetached: volumeRelatedInstance,
          },
        });
      })
      .catch(({ data }) => {
        return this.goToVolumeBlockStorage({
          cucCloudParams: {
            message: this.$translate.instant(
              'pci_projects_project_storages_volume_backup_create_action_create_volume_backup_fail',
              {
                message: data.message,
              },
            ),
            type: 'error',
          },
        });
      });
  }

  onGoToDetachVolumeFromInstanceButtonClick() {
    // TODO: Tracking -- MANAGER-10570

    return this.goToDetachVolume(this.volumeBackupModel.selected.volume);
  }

  onCreateBackupClick() {
    // TODO: Tracking -- MANAGER-10570
    const taskPromise = this.isVolumeBackupOption()
      ? this.createVolumeBackup()
      : this.createVolumeSnapshot();

    this.isCreating = true;
    return taskPromise.finally(() => {
      this.isCreating = false;
    });
  }
}
