import { STATUS } from './constants';

export default class Snapshot {
  constructor(snapshot) {
    Object.assign(this, snapshot);
  }

  isActive() {
    return STATUS.ACTIVE.includes(this.status);
  }

  isInactive() {
    return STATUS.INACTIVE.includes(this.status);
  }

  isPending() {
    return STATUS.PENDING.includes(this.status);
  }

  isBeingDeleted() {
    return this.status === 'deleting';
  }
}
