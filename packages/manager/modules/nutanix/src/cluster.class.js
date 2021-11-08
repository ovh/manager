export default class Cluster {
  constructor({ serviceName, targetSpec, status }) {
    Object.assign(this, {
      serviceName,
      targetSpec,
      status,
    });
    this.status = this.status.toLowerCase();
  }

  getNodes() {
    return this.targetSpec?.nodes || [];
  }

  getFirstNode() {
    return this.targetSpec?.nodes[0]?.server;
  }

  isRackAwareness() {
    return this.targetSpec.rackAwareness;
  }

  getNumberOfNodes() {
    return this.targetSpec?.nodes?.length || 0;
  }

  getLicense() {
    return this.targetSpec?.license;
  }
}
