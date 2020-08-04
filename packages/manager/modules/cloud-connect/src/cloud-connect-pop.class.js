export default class CloudConnectPop {
  constructor(cloudConnectPop) {
    Object.assign(this, cloudConnectPop);
  }

  isL3Type() {
    return this.type === 'l3';
  }

  isActive() {
    return this.status === 'active';
  }

  isInProcess() {
    return this.status === 'init' || this.status === 'toDelete';
  }

  isDeleting() {
    return this.status === 'toDelete';
  }

  isError() {
    return this.status === 'error';
  }

  setActive() {
    this.status = 'active';
  }

  setDeleting() {
    this.status = 'toDelete';
  }
}
