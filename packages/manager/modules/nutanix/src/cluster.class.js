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
}
