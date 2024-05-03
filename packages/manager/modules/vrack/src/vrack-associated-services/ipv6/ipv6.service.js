export default class VrackAssignedIpService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getIpVrackSubnet(serviceName, ipBlock) {
    return this.$http.get(
      `/vrack/${window.encodeURIComponent(
        serviceName,
      )}/ipv6/${window.encodeURIComponent(ipBlock)}/routedSubrange`,
    );
  }

  creatIpVrackSubnet(serviceName, ipBlock, { routedSubrange, nexthop }) {
    return this.$http.post(
      `/vrack/${window.encodeURIComponent(
        serviceName,
      )}/ipv6/${window.encodeURIComponent(ipBlock)}/routedSubrange`,
      {
        routedSubrange,
        nexthop,
      },
    );
  }

  deleteIpVrackSubnet(serviceName, ipBlock, routedSubrange) {
    return this.$http.delete(
      `/vrack/${window.encodeURIComponent(
        serviceName,
      )}/ipv6/${window.encodeURIComponent(
        ipBlock,
      )}/routedSubrange/${window.encodeURIComponent(routedSubrange)}`,
    );
  }
}
