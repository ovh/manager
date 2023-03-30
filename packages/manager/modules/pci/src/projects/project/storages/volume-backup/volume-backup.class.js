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

  get isCreating() {
    return this.status === VOLUME_BACKUP_STATUS.CREATING;
  }

  get isDeleting() {
    return this.status === VOLUME_BACKUP_STATUS.DELETING;
  }

  get isInError() {
    return this.status === VOLUME_BACKUP_STATUS.ERROR;
  }

  get isRunning() {
    return this.status === VOLUME_BACKUP_STATUS.OK;
  }

  get isRestoring() {
    return this.status === VOLUME_BACKUP_STATUS.RESTORING;
  }

  /**
   * indicate if volume backup is in pending operation (require time)
   * @returns {boolean}: true if pending status otherwise false
   */
  get isPendingStatus() {
    return [this.isCreating, this.isDeleting, this.isRestoring].some(
      (isPending) => isPending,
    );
  }

  get statusGroup() {
    return {
      error: [this.isInError].some((isError) => isError),
      warning: [this.isCreating, this.isRestoring, this.isDeleting].some(
        (isWarning) => isWarning,
      ),
      success: [this.isRunning].some((isValid) => isValid),
    };
  }

  updateData(data) {
    merge(this, data);
  }
}
