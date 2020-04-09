export default class {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;

    this.swsProxypassPath = 'apiv6';
  }

  getArpDetails(ipBlock, ip) {
    return this.$http
      .get(
        [
          this.swsProxypassPath,
          `ip/${window.encodeURIComponent(ipBlock)}/arp/${ip}`,
        ].join('/'),
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  unblockIp(ipBlock, ip) {
    return this.$http
      .post(
        [
          this.swsProxypassPath,
          `ip/${window.encodeURIComponent(ipBlock)}/arp/${ip}/unblock`,
        ].join('/'),
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }
}
