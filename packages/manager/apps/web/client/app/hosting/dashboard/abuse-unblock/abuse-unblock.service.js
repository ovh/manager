export default class HostingAbuseUnblockService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  /**
   * Unblock Tcp Out
   * @param {string} serviceName
   */
  unblockTcpOut(serviceName) {
    return this.$http.post(`/hosting/web/${serviceName}/unblockTCPOut`);
  }
}
