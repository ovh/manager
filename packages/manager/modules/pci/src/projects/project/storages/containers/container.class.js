import find from 'lodash/find';

export default class Container {
  constructor(resource) {
    this.publicUrl = null;
    Object.assign(this, resource);
  }

  getObjectById(objectId) {
    return find(this.objects, { name: objectId });
  }
}
