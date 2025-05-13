import get from 'lodash/get';
import includes from 'lodash/includes';

export default class {
  constructor(exchange) {
    Object.assign(this, exchange);

    this.version = get(this.serverDiagnostic, 'commercialVersion');
  }

  isProvider() {
    return this.offer === 'PROVIDER';
  }

  isHosted() {
    return this.offer === 'HOSTED';
  }

  isDedicated() {
    return this.offer === 'DEDICATED';
  }

  isDedicatedCluster() {
    return this.offer === 'DEDICATED_CLUSTER';
  }

  hasVersion(version) {
    return includes(this.version, version);
  }

  canBeRenewedMonthly() {
    return !(this.isProvider() && this.hasVersion(2010));
  }

  canBeDeletedAtExpiration() {
    return this.isHosted() || this.isProvider();
  }
}
