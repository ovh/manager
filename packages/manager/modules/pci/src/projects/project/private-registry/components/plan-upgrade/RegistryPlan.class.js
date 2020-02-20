import get from 'lodash/get';
import set from 'lodash/set';

export default class RegistyPlan {
  constructor(planDetails) {
    Object.assign(this, planDetails);
    set(this, 'name', get(this, 'name[0]'));
  }

  get capacity() {
    return get(this, 'registryLimits.imageStorage', 0);
  }

  get simultaneousConnections() {
    return get(this, 'blobs.technical.connection.total', 0);
  }

  isSmall() {
    return this.name === 'S';
  }

  hasUnlimitedBandwidth() {
    return get(this, 'blobs.technical.bandwidth.unlimited');
  }

  hasVulnerabilityScanning() {
    return get(this, 'features.vulnerability');
  }
}
