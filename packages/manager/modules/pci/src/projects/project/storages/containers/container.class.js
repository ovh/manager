import find from 'lodash/find';

import { STORAGE_GATEWAY } from './containers.constants';

export default class Container {
  constructor(resource) {
    this.publicUrl = null;
    Object.assign(this, resource);
  }

  getObjectById(objectId) {
    return find(this.objects, { name: objectId });
  }

  get storageGateway() {
    return STORAGE_GATEWAY.replace('REGION', this.region.toLowerCase());
  }
}
