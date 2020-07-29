export default class NodePool {
  constructor(pool) {
    Object.assign(this, pool);
  }

  isReady() {
    return this.status === 'READY';
  }

  isUpdating() {
    return this.status === 'UPDATING';
  }

  isProcessing() {
    return !this.isError() && !this.isReady();
  }

  isError() {
    return this.status === 'ERROR';
  }
}
