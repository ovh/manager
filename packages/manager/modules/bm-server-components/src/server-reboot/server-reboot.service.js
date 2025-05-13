export default class DedicatedServerRebootService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  reboot(serviceName) {
    return this.$http
      .post(`/dedicated/server/${serviceName}/reboot`)
      .then(({ data }) => data);
  }
}
