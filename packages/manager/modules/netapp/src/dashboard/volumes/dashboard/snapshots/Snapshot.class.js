import { STATUS } from './constants';

export default class Snapshot {
  constructor({ id, name, description, createdAt, type, status }) {
    Object.assign(this, {
      id,
      name,
      description,
      createdAt,
      type,
      status,
    });
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
}
