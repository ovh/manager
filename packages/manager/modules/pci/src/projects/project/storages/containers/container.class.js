import find from 'lodash/find';
import {
  NO_ENCRYPTION_VALUE,
  OPENIO_DEFAULT_REGION,
} from './containers.constants';

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
    s3StorageType,
    publicUrl,
    regionDetails,
    virtualHost,
    state,
    storageGateway,
    encryption,
    versioning,
    deploymentMode,
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
      s3StorageType,
      ...(publicUrl && { publicUrl }),
      ...(regionDetails && { regionDetails }),
      ...(virtualHost && { virtualHost }),
      ...(versioning && { versioning }),
      deploymentMode,
      state,
      storageGateway,
      encryption,
    });
    this.storedObjects = this.storedObjects || this.objectsCount || 0;
    this.storedBytes = this.storedBytes || this.objectsSize;
    this.id = this.id || this.name;
    this.s3StorageType = this.s3StorageType || null;
    this.region = this.region || OPENIO_DEFAULT_REGION;
    this.encryption = this.encryption || { sseAlgorithm: null };
  }

  getObjectById(objectId) {
    return find(this.objects, { name: objectId });
  }

  get isEncrypted() {
    const { sseAlgorithm } = this.encryption;
    return sseAlgorithm && sseAlgorithm !== NO_ENCRYPTION_VALUE;
  }
}
