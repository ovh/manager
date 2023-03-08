import moment from 'moment';

import {
  VOLUME_BACKUP_NAME_PREFIX,
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

  static buildLink(hrefLink, linkMessage) {
    return `<a
      href="${hrefLink}"
      target="_blank"
      rel="noopener"
    >
      <span>${linkMessage}</span>
      <span
        class="oui-icon oui-icon-external-link"
        aria-hidden="true"
      ></span>
    </a>`;
  }

  buildSuccessSnapshotBackupCucMessage(backupName) {
    const msgPart1 = this.$translate.instant(
      'pci_projects_project_storages_volume_backup_create_action_create_option_volume_snapshot_success',
      {
        backupName: `<strong>${backupName}</strong>`,
      },
    );
    const linkMessage = this.$translate.instant(
      'pci_projects_project_storages_volume_backup_create_action_create_option_volume_backup_success_snapshot_link',
    );

    return {
      textHtml: `${msgPart1} <br/> ${VolumeBackupCreateController.buildLink(
        this.volumeSnapshotStorageLink,
        linkMessage,
      )}`,
    };
  }

  buildSuccessVolumeBackupCucMessage(backupName) {
    const msgPart1 = this.$translate.instant(
      'pci_projects_project_storages_volume_backup_create_action_create_option_volume_backup_success',
      {
        backupName: `<strong>${backupName}</strong>`,
      },
    );
    const linkMessage = this.$translate.instant(
      'pci_projects_project_storages_volume_backup_create_action_create_option_volume_backup_success_block_storage_link',
    );

    return {
      textHtml: `${msgPart1} <br/> ${VolumeBackupCreateController.buildLink(
        this.volumeBlockStorageLink,
        linkMessage,
      )}`,
    };
  }

  createVolumeSnapshot() {
    const { name } = this.volumeBackupModel;
    const { volume } = this.volumeBackupModel.selected;

    return this.volumeBackupService
      .createVolumeSnapshot(this.projectId, volume.id, { name })
      .then(() => {
        return this.goToVolumeBackups(
          this.buildSuccessSnapshotBackupCucMessage(name),
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
          this.buildSuccessVolumeBackupCucMessage(name, volume.name),
        );
      });
  }

  onVolumeChange(volume) {
    this.volumeBackupModel.name = `${VOLUME_BACKUP_NAME_PREFIX}-${
      volume.name
    }-${moment().format('DD-MM-YYYY_HH:mm:ss')}`;
  }

  onGoToDetachVolumeFromInstanceButtonClick() {
    // TODO: Tracking -- MANAGER-10570

    const { volume, volumeOption } = this.volumeBackupModel.selected;
    return this.goToDetachVolume(volume, volumeOption);
  }

  onCreateBackupClick() {
    // TODO: Tracking -- MANAGER-10570
    const taskPromise = this.isVolumeBackupOption()
      ? this.createVolumeBackup()
      : this.createVolumeSnapshot();

    this.isCreating = true;
    return taskPromise
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
