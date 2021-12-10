import { STATUS } from './databases.constants';

export default class Base {
  get statusGroup() {
    switch (this.status) {
      case STATUS.PENDING:
      case STATUS.CREATING:
      case STATUS.UPDATING:
      case STATUS.DELETING:
        return STATUS.PENDING;
      case STATUS.ERROR:
      case STATUS.ERROR_SPEC:
        return STATUS.ERROR;
      case STATUS.READY:
        return STATUS.READY;
      default:
        return this.status.toUpperCase();
    }
  }

  isStatusGroupReady() {
    return this.statusGroup === STATUS.READY;
  }

  isStatusGroupPending() {
    return this.statusGroup === STATUS.PENDING;
  }

  isStatusGroupError() {
    return this.statusGroup === STATUS.ERROR;
  }

  isActive() {
    return this.status === STATUS.READY;
  }

  isDeleting() {
    return this.status === STATUS.DELETING;
  }

  isProcessing() {
    return this.statusGroup === STATUS.PENDING;
  }
}
