import find from 'lodash/find';

import Base from './base.class';
import {
  SSL_MODE_REQUIRED,
  SSL_MODE_NA,
  SSL_MODE_SSL_TLS,
} from './databases.constants';

import { ENGINES_NAMES } from './engines.constants';

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
      if (SSL_MODE_SSL_TLS.includes(this.sslMode)) {
        this.sslModeKey = 'SSL_TLS';
      }
    }
    return this.sslModeKey;
  }

  updateData(data) {
    Object.assign(this, data);
  }
}
