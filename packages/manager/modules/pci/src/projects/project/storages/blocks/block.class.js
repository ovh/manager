import includes from 'lodash/includes';
import { VOLUME_MIN_SIZE } from './block.constants';

export default class BlockStorage {
  constructor(resource) {
    this.bootable = false;
    this.size = VOLUME_MIN_SIZE;
    Object.assign(this, resource);
  }

  get statusGroup() {
    if (includes(['available', 'in-use'], this.status)) {
      return 'ACTIVE';
    }
    if (
      includes(
        [
          'creating',
          'attaching',
          'detaching',
          'deleting',
          'backing-up',
          'restoring-backup',
          'snapshotting',
          'awaiting-transfer',
        ],
        this.status,
      )
    ) {
      return 'PENDING';
    }
    if (
      includes(
        ['error', 'error_deleting', 'error_restoring', 'error_extending'],
        this.status,
      )
    ) {
      return 'ERROR';
    }
    return this.status;
  }

  isDeletable() {
    return this.isAttachable() && !this.hasSnapshots();
  }

  isAttachable() {
    return this.attachedTo.length === 0;
  }

  isDetachable() {
    return this.attachedTo.length > 0;
  }

  hasSnapshots() {
    return this.snapshots.length > 0;
  }
}
