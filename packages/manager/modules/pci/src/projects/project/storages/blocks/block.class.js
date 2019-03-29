import includes from 'lodash/includes';

export default class BlockStorage {
  constructor(resource) {
    Object.assign(this, resource);
  }

  get statusGroup() {
    if (includes(['available', 'in-use'], this.status)) {
      return 'ACTIVE';
    }
    if (includes(['creating', 'attaching', 'detaching', 'deleting', 'backing-up', 'restoring-backup', 'snapshotting'], this.status)) {
      return 'PENDING';
    }
    if (includes(['error', 'error_deleting', 'error_restoring', 'error_extending'], this.status)) {
      return 'ERROR';
    }
    return this.status;
  }

  isDeletable() {
    return this.attachedTo.length === 0;
  }

  isAttachable() {
    return this.attachedTo.length === 0;
  }

  isDetachable() {
    return this.attachedTo.length > 0;
  }
}
