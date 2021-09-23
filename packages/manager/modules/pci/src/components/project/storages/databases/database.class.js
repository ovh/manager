import find from 'lodash/find';

import Base from './base.class';
import { SSL_MODE_REQUIRED, SSL_MODE_NA } from './databases.constants';

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
      nodes,
      flavor,
      sslMode,
      host,
      port,
      uri,
    });
  }

  setStatus(status) {
    this.status = status;
  }

  get region() {
    return this.nodes[0]?.region;
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
    nodes.forEach((node) => {
      const nodeObj = this.getNode(node.id);
      return nodeObj ? nodeObj.updateData(node) : this.addNode(node);
    });
  }

  getEngineFromList(engines) {
    if (!this.currentEngine) {
      this.currentEngine = engines.find(
        (engine) => engine.name === this.engine,
      );
    }
    return this.currentEngine;
  }

  getSSLModeKey() {
    if (!this.sslModeKey) {
      this.sslModeKey = this.sslMode;
      if (SSL_MODE_REQUIRED.includes(this.sslMode)) {
        this.sslModeKey = 'required';
      }
      if (SSL_MODE_NA.includes(this.sslMode)) {
        this.sslModeKey = 'n/a';
      }
    }
    return this.sslModeKey;
  }

  updateData(data) {
    Object.assign(this, data);
  }
}
