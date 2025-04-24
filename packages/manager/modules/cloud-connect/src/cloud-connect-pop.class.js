import { POP_TYPE_CONSTANT, STATUS } from './cloud-connect.constants';

export default class CloudConnectPop {
  constructor({
    customerBgpArea,
    id,
    interfaceId,
    ovhBgpArea,
    status,
    subnet,
    type,
    bgpStatus,
    lastUpdateBgpStatus,
  }) {
    Object.assign(this, {
      customerBgpArea,
      id,
      interfaceId,
      ovhBgpArea,
      status,
      subnet,
      type,
      bgpStatus,
      lastUpdateBgpStatus,
    });
  }

  isL3Type() {
    return this.type === POP_TYPE_CONSTANT.L3;
  }

  isL2Type() {
    return this.type === POP_TYPE_CONSTANT.L2;
  }

  isActive() {
    return this.status === STATUS.ACTIVE;
  }

  isInProcess() {
    return this.status === STATUS.INIT || this.status === STATUS.TO_DELETE;
  }

  isDeleting() {
    return this.status === STATUS.TO_DELETE;
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

  isBgpStatusUp() {
    return this.bgpStatus === STATUS.UP;
  }

  isBgpStatusDown() {
    return this.bgpStatus === STATUS.DOWN;
  }
}
