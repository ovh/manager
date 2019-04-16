import includes from 'lodash/includes';

export default class InstanceBackup {
  constructor(resource) {
    Object.assign(this, resource);
  }

  get statusGroup() {
    if (includes(['active'], this.status)) {
      return 'ACTIVE';
    }
    if (includes(['saving'], this.status)) {
      return 'SAVING';
    }
    return this.status.toUpperCase();
  }

  isDeletable() {
    return this.statusGroup === 'ACTIVE';
  }
}
