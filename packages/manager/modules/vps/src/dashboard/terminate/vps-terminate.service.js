export default class VpsTerminate {
  /* @ngInject */
  constructor($http, OvhApiVps) {
    this.$http = $http;
    this.OvhApiVps = OvhApiVps;
  }

  confirm(serviceName, hasMailConfirmation = true) {
    return hasMailConfirmation
      ? this.OvhApiVps.v6().terminate({
          serviceName,
        }).$promise
      : this.$http.delete(`/services/${serviceName}`);
  }
}
