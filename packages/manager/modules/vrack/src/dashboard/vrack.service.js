export default class Vrack {
  constructor($http) {
    this.$http = $http;
  }

  createIpv6(serviceName, ipv6) {
    return this.$http.post(`/vrack/${serviceName}/ipv6`, { block: ipv6 });
  }
}
