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
    const ip = _ip;

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
