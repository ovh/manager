export default class CloudConnectServiceKey {
  constructor(cloudConnectServiceKey) {
    Object.assign(this, cloudConnectServiceKey);
  }

  isActive() {
    return this.status === 'active';
  }

  isInProcess() {
    return this.status === 'toCheck' || this.status === 'doing';
  }

  isError() {
    return this.status === 'cancelled' || this.status === 'terminated';
  }
}
