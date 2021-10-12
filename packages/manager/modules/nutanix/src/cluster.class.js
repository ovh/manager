export default class Cluster {
  constructor({ serviceName, targetSpec, status }) {
    Object.assign(this, {
      serviceName,
      targetSpec,
      status,
    });
  }

  getNodes() {
    return this.targetSpec?.nodes || [];
  }

  getFirstNode() {
    return this.targetSpec?.nodes[0]?.server;
  }
}
