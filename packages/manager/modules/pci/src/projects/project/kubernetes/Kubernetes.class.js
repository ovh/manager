export default class Kubernetes {
  constructor(cluster) {
    Object.assign(this, cluster);
  }

  isReady() {
    return this.status === 'READY';
  }

  isUpdating() {
    return this.status === 'UPDATING';
  }

  hasLatestPatchVersion() {
    return this.isUpToDate;
  }
}
