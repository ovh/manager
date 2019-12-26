import { VPS_TYPE } from './constants';

export default class IpReverse {
  /* @ngInject */
  constructor($q, constants, IpExpandIpv6, OvhApiIp, OvhApiVpsIps) {
    this.$q = $q;
    this.constants = constants;
    this.IpExpandIpv6 = IpExpandIpv6;
    this.OvhApiIp = OvhApiIp;
    this.OvhApiVpsIps = OvhApiVpsIps;
  }

  updateReverse(ipBlock, _ip, _reverse) {
    const reverse = _reverse
      ? punycode.toASCII(_reverse.replace(/\s/g, ''))
      : '';
    let ip = _ip;

    // For legacy VPS
    if (ipBlock.type === VPS_TYPE) {
      if (~_ip.indexOf(':')) {
        ip = this.IpExpandIpv6.expandIPv6Address(_ip);
      }

      return this.OvhApiVpsIps.v6().put(
        {
          serviceName: ipBlock.service.serviceName,
          ipAddress: ip,
        },
        {
          reverse,
        },
      ).$promise;
    }

    if (!reverse) {
      return this.deleteReverse(ipBlock.ipBlock, ip);
    }

    return this.OvhApiIp.Reverse()
      .v6()
      .create(
        {
          ip: ipBlock.ipBlock,
        },
        {
          ipReverse: ip,
          reverse,
        },
      ).$promise;
  }

  getReverse(ipBlock, ip) {
    return this.OvhApiIp.Reverse()
      .v6()
      .get({
        ip: window.encodeURIComponent(ipBlock),
        ipReverse: ip,
      }).$promise;
  }

  deleteReverse(ipBlock, ip) {
    return this.OvhApiIp.Reverse()
      .v6()
      .delete({
        ip: window.encodeURIComponent(ipBlock),
        ipReverse: ip,
      }).$promise;
  }

  getDelegations(ipBlock) {
    return this.OvhApiIp.Delegation()
      .v6()
      .query({
        ip: ipBlock,
      }).$promise;
  }

  getDelegation(ipBlock, target) {
    return this.OvhApiIp.Delegation()
      .v6()
      .get({
        ip: ipBlock,
        target,
      }).$promise;
  }

  setDelegation(ipBlock, target) {
    return this.OvhApiIp.Delegation()
      .v6()
      .save(
        {
          ip: ipBlock,
        },
        {
          target: window.encodeURIComponent(target),
        },
      ).$promise;
  }

  deleteDelegation(ipBlock, target) {
    return this.OvhApiIp.Delegation()
      .v6()
      .delete({
        ip: ipBlock,
        target,
      }).$promise;
  }
}

angular.module('Module.ip.services').service('IpReverse', IpReverse);
