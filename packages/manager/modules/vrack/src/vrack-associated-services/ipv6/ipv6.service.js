export default class VrackAssignedIpService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getIpVrackSubnet(serviceName, ipBlock) {
    return this.$http.get(
      `/vrack/${encodeURIComponent(serviceName)}/ipv6/${encodeURIComponent(
        ipBlock,
      )}/routedSubrange`,
    );
  }

  creatIpVrackSubnet(serviceName, ipBlock, { routedSubrange, nexthop }) {
    return this.$http.post(
      `/vrack/${encodeURIComponent(serviceName)}/ipv6/${encodeURIComponent(
        ipBlock,
      )}/routedSubrange`,
      {
        routedSubrange,
        nexthop,
      },
    );
  }

  deleteIpVrackSubnet(serviceName, ipBlock, routedSubrange) {
    return this.$http.delete(
      `/vrack/${encodeURIComponent(serviceName)}/ipv6/${encodeURIComponent(
        ipBlock,
      )}/routedSubrange/${encodeURIComponent(routedSubrange)}`,
    );
  }
}
