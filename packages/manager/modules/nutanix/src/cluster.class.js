import { CLUSTER_STATUS } from './constants';

export default class Cluster {
  constructor({ serviceName, targetSpec, status, nodeDetails }) {
    Object.assign(this, {
      serviceName,
      targetSpec,
      status,
      nodeDetails,
    });
    this.status = this.status.toLowerCase();
  }

  getNodes() {
    return this.targetSpec?.nodes || [];
  }

  isActive() {
    return this.status === CLUSTER_STATUS.ACTIVE;
  }

  isError() {
    return this.status === CLUSTER_STATUS.ERROR;
  }

  isDeploying() {
    return this.status === CLUSTER_STATUS.DEPLOYING;
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

  setNodeDetails(nodeDetails) {
    this.nodeDetails = nodeDetails;
  }
}
