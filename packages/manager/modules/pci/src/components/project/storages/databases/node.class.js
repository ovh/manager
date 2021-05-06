import Base from './base.class';

export default class Node extends Base {
  constructor({ createdAt, id, port, status, name, flavor, region }) {
    super();
    this.updateData({
      createdAt,
      id,
      port,
      status,
      name,
      flavor,
      region,
    });
  }

  updateData({ createdAt, id, port, status, name, flavor, region }) {
    Object.assign(this, { createdAt, id, port, status, name, flavor, region });
  }
}
