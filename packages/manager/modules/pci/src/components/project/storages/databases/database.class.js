import find from 'lodash/find';

import Base from './base.class';

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
    });
  }

  get flavor() {
    return this.nodes[0]?.flavor;
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

  setNodes(nodes) {
    nodes.forEach((node) => {
      const nodeObj = this.getNode(node.id);
      return nodeObj ? nodeObj.updateData(node) : this.addNode(node);
    });
  }

  updateData(data) {
    Object.assign(this, data);
  }
}
