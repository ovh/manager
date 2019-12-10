import find from 'lodash/find';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';

export default class IpLoadBalancerServerFarmProbeEditCtrl {
  /* @ngInject */
  constructor($uibModalInstance, IpLoadBalancerConstant, availableProbes, edition, farm) {
    this.$uibModalInstance = $uibModalInstance;
    this.IpLoadBalancerConstant = IpLoadBalancerConstant;
    this.availableProbes = availableProbes;
    this.edition = edition;
    this.farm = farm;
    this.farmProbe = this.farm.probe ? angular.copy(this.farm.probe) : {
      match: 'default',
    };

    this.methods = IpLoadBalancerConstant.probeMethods;
    this.matches = IpLoadBalancerConstant.probeMatches;
    this.rules = this.getRules();

    if (!includes(this.getMatches(), this.farm.probe.match)) {
      this.farmProbe.match = null;
      this.farmProbe.pattern = null;
      this.farmProbe.negate = null;
    }

    if (!this.edition) {
      this.farmProbe.port = this.farm.port;
      this.farmProbe.interval = 30;

      switch (this.farmProbe.type) {
        case 'http':
          this.farmProbe.method = 'GET';
          this.farmProbe.url = '/';
          break;
        default: break;
      }

      this.farmProbe.match = 'default';

      if (this.farmProbe.type === 'oco') {
        delete this.farmProbe.port;
      }
    } else if (this.farmProbe.negate === null) {
      this.farmProbe.negate = false;
    }
  }

  isFieldVisible(field) {
    if (field === 'pattern') {
      return this.farmProbe.match !== 'default';
    }

    if (field === 'match' && isArray(this.rules.matches)
            && this.rules.matches.length === 1) {
      return false;
    }

    return !Object.prototype.hasOwnProperty.call(this.rules, field)
            || !!this.rules[field];
  }

  getMatches() {
    return this.rules.matches;
  }

  getRules() {
    return find(this.availableProbes, {
      type: this.farmProbe.type,
    });
  }

  cleanProbe() {
    if (this.farmProbe.match === 'default') {
      this.farmProbe.pattern = null;
    }
    if (!this.farmProbe.negate) {
      this.farmProbe.negate = null;
    }
  }

  close() {
    this.cleanProbe();
    this.$uibModalInstance.close(this.farmProbe);
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}
