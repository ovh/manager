import includes from 'lodash/includes';

export default class VolumeSnapshot {
  constructor(resource) {
    Object.assign(this, resource);
  }

  get statusGroup() {
    let statusGroup = this.status.toUpperCase();
    if (includes(['error', 'error_deleting'], this.status)) {
      statusGroup = 'ERROR';
    }
    return statusGroup;
  }
}
