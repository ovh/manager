import merge from 'lodash/merge';

import { VOLUME_BACKUP_STATUS } from './volume-backup.constants';

export default class VolumeBackup {
  /**
   * Create a VolumeBackup instance
   * @param volumeBackup {Object}: volume backup JSON object
   */
  constructor(volumeBackup) {
    merge(this, volumeBackup);
  }

  isCreating() {
    return this.status === VOLUME_BACKUP_STATUS.CREATING;
  }

  isDeleting() {
    return this.status === VOLUME_BACKUP_STATUS.DELETING;
  }

  isInError() {
    return this.status === VOLUME_BACKUP_STATUS.ERROR;
  }

  isRunning() {
    return this.status === VOLUME_BACKUP_STATUS.OK;
  }

  isRestoring() {
    return this.status === VOLUME_BACKUP_STATUS.RESTORING;
  }

  get statusGroup() {
    return {
      error: [VOLUME_BACKUP_STATUS.ERROR].includes(this.status),
      warning: [
        VOLUME_BACKUP_STATUS.CREATING,
        VOLUME_BACKUP_STATUS.RESTORING,
        VOLUME_BACKUP_STATUS.DELETING,
      ].includes(this.status),
      success: [VOLUME_BACKUP_STATUS.OK].includes(this.status),
    };
  }

  updateData(data) {
    merge(this, data);
  }
}
