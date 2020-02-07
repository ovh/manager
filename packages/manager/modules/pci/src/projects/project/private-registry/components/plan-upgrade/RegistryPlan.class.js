import get from 'lodash/get';
import set from 'lodash/set';
import includes from 'lodash/includes';

export default class RegistyPlan {
  constructor(resource) {
    Object.assign(this, resource);
    set(this, 'displayName', get(this, 'name[0]'));
  }

  get capacity() {
    return get(this, 'registryLimits.imageStorage', 0);
  }

  get simultaneousConnections() {
    return get(this, 'blobs.technical.connection.total', 0);
  }

  get concurrency() {
    return get(this, 'blobs.technical.connection.clients.concurrency', 0);
  }

  get connectionsNumber() {
    return get(this, 'blobs.technical.connection.clients.number', 0);
  }

  hasUnlimitedBandwidth() {
    return get(this, 'blobs.technical.bandwidth.unlimited');
  }

  hasVulnerabilityScanning() {
    return get(this, 'features.vulnerability');
  }

  showCoreRegistryNinetyNine() {
    return includes(this, 'SMALL');
  }

  showOtherComponents() {
    return includes(this, 'MEDIUM') || includes(this, 'LARGE');
  }
}
