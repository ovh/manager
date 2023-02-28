import { VOLUME_BACKUP_STATUS } from '../volume-backup.constants';

export default class VolumeBackupListController {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.cucCloudMessage = CucCloudMessage;
  }

  $onInit() {
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

  static isRestoreVolumeActionAvailable({ status }) {
    return [VOLUME_BACKUP_STATUS.OK].includes(status);
  }

  static isCreateVolumeActionAvailable({ status }) {
    return [VOLUME_BACKUP_STATUS.OK].includes(status);
  }

  static isDeleteVolumeBackupActionAvailable({ status }) {
    return [VOLUME_BACKUP_STATUS.OK, VOLUME_BACKUP_STATUS.ERROR].includes(
      status,
    );
  }

  static isGlobalActionsMenuAvailable(volumeBackup) {
    const Ctrl = VolumeBackupListController;
    return [
      Ctrl.isCreateVolumeActionAvailable(volumeBackup),
      Ctrl.isRestoreVolumeActionAvailable(volumeBackup),
      Ctrl.isDeleteVolumeBackupActionAvailable(volumeBackup),
    ].some((actionAvailable) => actionAvailable);
  }

  onCreateVolumeBackupClick() {
    // TODO: tracking

    return this.goToCreateVolumeBackup();
  }

  onRestoreVolumeClick(volumeBackup) {
    // TODO: tracking - MANAGER-10570

    return this.goToRestoreVolume(volumeBackup);
  }

  onCreateVolumeClick() {
    // TODO: tracking - MANAGER-10570

    return this.goToAddVolumeBlockStorage();
  }

  onDeleteVolumeBackupClick(volumeBackup) {
    // TODO: tracking - MANAGER-10570

    return this.goToDeleteVolumeBackup(volumeBackup);
  }
}
