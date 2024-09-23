export default class Vrack {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  addIpv6(serviceName, ipv6) {
    return this.$http.post(`/vrack/${serviceName}/ipv6`, { block: ipv6 });
  }

  deleteIpv6(serviceName, ipv6) {
    return this.$http.delete(
      `/vrack/${serviceName}/ipv6/${encodeURIComponent(ipv6)}`,
    );
  }

  getIpInfo(ip) {
    return this.$http.get(`/ip/${encodeURIComponent(ip)}`);
  }
}
