import { STATUS } from './cloud-connect.constants';

export default class CloudConnectDatacenterExtra {
  constructor({
    bgpNeighborArea,
    bgpNeighborIp,
    id,
    nextHop,
    subnet,
    status,
    type,
  }) {
    Object.assign(this, {
      bgpNeighborArea,
      bgpNeighborIp,
      id,
      nextHop,
      subnet,
      status,
      type,
    });
  }

  isActive() {
    return this.status === STATUS.ACTIVE;
  }

  isInProcess() {
    return this.status === STATUS.INIT || this.status === STATUS.TO_DELETE;
  }

  isError() {
    return this.status === STATUS.ERROR;
  }

  setActive() {
    this.status = STATUS.ACTIVE;
  }

  setDeleting() {
    this.status = STATUS.TO_DELETE;
  }
}
