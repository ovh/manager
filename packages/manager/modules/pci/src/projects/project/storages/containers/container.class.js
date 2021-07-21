import find from 'lodash/find';
import { OPENIO_DEFAULT_REGION } from './containers.constants';

export default class Container {
  constructor({
    name,
    objects,
    objectsCount,
    objectsSize,
    archive,
    containerType,
    cors,
    id,
    region,
    staticUrl,
    storedBytes,
    storedObjects,
    isHighPerfStorage,
    publicUrl,
    state,
  }) {
    Object.assign(this, {
      name,
      objects,
      objectsCount,
      objectsSize,
      archive,
      containerType,
      cors,
      id,
      region,
      staticUrl,
      storedBytes,
      storedObjects,
      isHighPerfStorage,
      publicUrl,
      state,
    });
    this.id = this.id || this.name;
    this.region = this.region || OPENIO_DEFAULT_REGION;
  }

  getObjectById(objectId) {
    return find(this.objects, { name: objectId });
  }
}
