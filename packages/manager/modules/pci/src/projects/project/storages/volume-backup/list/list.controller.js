import {
  VOLUME_BACKUP_STATUS,
  VOLUME_BACKUP_TRACKING,
} from '../volume-backup.constants';

export default class VolumeBackupListController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, CHANGELOG) {
    this.$translate = $translate;
    this.cucCloudMessage = CucCloudMessage;
    this.CHANGELOG = CHANGELOG;
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
    this.trackClick(VOLUME_BACKUP_TRACKING.LISTING.ADD);

    return this.goToCreateVolumeBackup();
  }

  onRestoreVolumeClick(volumeBackup) {
    this.trackClick(VOLUME_BACKUP_TRACKING.LISTING.ROW_CTA_RESTORE_VOLUME);

    return this.goToRestoreVolume(volumeBackup);
  }

  onCreateVolumeClick(volumeBackup) {
    this.trackClick(VOLUME_BACKUP_TRACKING.LISTING.ROW_CTA_CREATE_VOLUME);

    return this.goToCreateVolume(volumeBackup);
  }

  onDeleteVolumeBackupClick(volumeBackup) {
    this.trackClick(VOLUME_BACKUP_TRACKING.LISTING.ROW_CTA_DELETE_VOLUME);

    return this.goToDeleteVolumeBackup(volumeBackup);
  }
}
