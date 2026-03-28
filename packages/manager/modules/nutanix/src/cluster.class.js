import { CLUSTER_STATUS, MIN_VERSION_DATASERVICEIP } from './constants';

export default class Cluster {
  constructor({
    serviceName,
    targetSpec,
    status,
    nodeDetails,
    availableVersions,
    allowedRedundancyFactor,
    iam,
  }) {
    Object.assign(this, {
      serviceName,
      targetSpec,
      status,
      nodeDetails,
      availableVersions,
      allowedRedundancyFactor,
      iam,
    });
    this.loadingDatacenter = false;
    this.status = this.status.toLowerCase();
    this.stateBilling = null;
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

  setLoadingDatacenter(loading) {
    this.loadingDatacenter = loading;
  }

  setDatacenter(dcName) {
    this.datacenter = dcName;
  }

  setStateBilling(state) {
    this.stateBilling = state;
  }

  canModifyDataServiceIp() {
    const wantedVersion = this.targetSpec.version;
    const sortedAllowed = [...MIN_VERSION_DATASERVICEIP].sort((a, b) =>
      Cluster.compareVersions(a, b),
    );

    let isGTE = sortedAllowed.some(
      (a) => Cluster.compareVersions(wantedVersion, a) >= 0,
    );

    if (!isGTE) {
      return false;
    }

    sortedAllowed.slice(0, -1).forEach((ai, i) => {
      const ai1 = sortedAllowed[i + 1];
      const cmp1 = Cluster.compareVersions(wantedVersion, ai);
      const cmp2 = Cluster.compareVersions(wantedVersion, ai1);

      if (cmp1 > 0 && cmp2 < 0) {
        if (Cluster.getBranch(wantedVersion) !== Cluster.getBranch(ai)) {
          isGTE = false;
        }
      }
    });

    return isGTE;
  }

  static getBranch(v) {
    const parts = v.split('.');
    return parts.slice(0, 2).join('.');
  }

  static compareVersions(v1, v2) {
    const a1 = v1.split('.').map(Number);
    const a2 = v2.split('.').map(Number);
    const len = Math.max(a1.length, a2.length);

    for (let i = 0; i < len; i += 1) {
      const p1 = i < a1.length ? a1[i] : 0;
      const p2 = i < a2.length ? a2[i] : 0;

      if (p1 > p2) {
        return 1;
      }

      if (p1 < p2) {
        return -1;
      }
    }

    return 0;
  }
}
