export default class CloudConnectDatacenterExtra {
  constructor(extra) {
    Object.assign(this, extra);
  }

  isActive() {
    return this.status === 'active';
  }

  isInProcess() {
    return this.status === 'init' || this.status === 'toDelete';
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
