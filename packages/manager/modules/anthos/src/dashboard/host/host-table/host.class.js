import { HOST_STATUS, STATUS } from './constants';

export default class Host {
  constructor({
    id,
    name,
    profile,
    privateIp,
    rack,
    stateful,
    additional,
    status,
    serviceName,
  }) {
    this.update({
      id,
      name,
      profile,
      privateIp,
      rack,
      stateful,
      additional,
      status,
      serviceName,
    });
  }

  get statusGroup() {
    switch (this.status) {
      case HOST_STATUS.UNKNOWN:
      case HOST_STATUS.DELETING:
        return STATUS.ERROR;
      case HOST_STATUS.AVAILABLE:
      case HOST_STATUS.IN_USE:
        return STATUS.ACTIVE;
      case HOST_STATUS.DELIVERING:
      case HOST_STATUS.IN_MAINTENANCE:
      case HOST_STATUS.RESTARTING:
        return STATUS.PENDING;
      default:
        return STATUS.ERROR;
    }
  }

  isActive() {
    return this.statusGroup === STATUS.ACTIVE;
  }

  update(data) {
    Object.assign(this, data);
  }
}
