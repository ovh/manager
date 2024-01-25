import find from 'lodash/find';

import Base from './base.class';

import { ENGINES_NAMES } from './engines.constants';
import { DATABASE_TYPES } from '../../../../projects/project/storages/databases/databases.constants';
import { OLD_MONGODB_PLANS } from './databases.constants';
import Node from './node.class';

export default class Database extends Base {
  constructor({
    createdAt,
    plan,
    id,
    status,
    nodeNumber,
    description,
    maintenanceWindow,
    version,
    domain,
    networkType,
    networkId,
    subnetId,
    engine,
    nodes,
    flavor,
    sslMode,
    host,
    port,
    uri,
    aclsEnabled,
    endpoints,
    maintenanceTime,
    backupTime,
    disk,
    storage,
  }) {
    super();
    this.updateData({
      createdAt,
      plan,
      id,
      status,
      nodeNumber,
      description,
      maintenanceWindow,
      version,
      domain,
      networkType,
      networkId,
      subnetId,
      engine,
      nodes: nodes.map((node) => new Node(node)),
      flavor,
      sslMode,
      host,
      port,
      uri,
      aclsEnabled,
      endpoints,
      maintenanceTime,
      backupTime,
      disk,
      storage,
    });
  }

  setStatus(status) {
    this.status = status;
  }

  get region() {
    return this.nodes[0]?.region;
  }

  getEngineLabel() {
    return ENGINES_NAMES[this.engine];
  }

  addNode(node) {
    return this.nodes.push(node);
  }

  getNode(nodeId) {
    return find(this.nodes, { id: nodeId });
  }

  setNodeStatus(node, status) {
    const nodeObj = this.getNode(node.id);
    nodeObj.status = status;
  }

  deleteNode(nodeId) {
    this.nodes = this.nodes.filter((n) => n.id !== nodeId);
  }

  setNodes(nodes) {
    this.nodes = nodes;
  }

  getEngineFromList(engines) {
    if (!this.currentEngine) {
      this.currentEngine = engines.find(
        (engine) => engine.name === this.engine,
      );
    }
    return this.currentEngine;
  }

  get isOldMongoPlan() {
    return (
      this.engine === DATABASE_TYPES.MONGO_DB &&
      OLD_MONGODB_PLANS.includes(this.plan)
    );
  }

  updateData(data) {
    Object.assign(this, data);
    // only update nodes if they are provided in data
    if (data.nodes) {
      this.nodes = data.nodes.map((node) => new Node(node));
    }
    this.storage.size.sizeInMB = this.storage.size.value;
    if (this.storage.size.unit === 'GB') {
      this.storage.size.sizeInMB *= 1000;
    }
  }
}
