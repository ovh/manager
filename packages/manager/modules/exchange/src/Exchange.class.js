import _ from 'lodash';

export default class {
  constructor(exchange) {
    Object.assign(this, exchange);

    this.version = _.get(this.serverDiagnostic, 'commercialVersion');
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
    return _.includes(this.version, version);
  }

  canBeRenewedMonthly() {
    return !(this.isProvider() && this.hasVersion(2010));
  }

  canBeDeletedAtExpiration() {
    return this.isHosted() || this.isProvider();
  }
}
