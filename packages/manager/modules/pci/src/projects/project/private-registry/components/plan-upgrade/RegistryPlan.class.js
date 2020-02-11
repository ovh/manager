import get from 'lodash/get';
import includes from 'lodash/includes';
import { PLAN_CONSTANT } from './constants';

export default class RegistyPlan {
  constructor(resource) {
    Object.assign(this, resource);
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
    return includes(this, PLAN_CONSTANT.SMALL);
  }

  showOtherComponents() {
    return (
      includes(this, PLAN_CONSTANT.MEDIUM) ||
      includes(this, PLAN_CONSTANT.LARGE)
    );
  }
}
