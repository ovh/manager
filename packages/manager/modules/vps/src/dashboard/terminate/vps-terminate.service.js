export default class VpsTerminate {
  /* @ngInject */
  constructor($http, OvhApiVps) {
    this.$http = $http;
    this.OvhApiVps = OvhApiVps;
  }

  confirm(service, hasMailConfirmation = true) {
    return hasMailConfirmation
      ? this.OvhApiVps.v6().terminate({
        serviceName: service.serviceName,
      }).$promise
      : this.$http.delete(`/services/${service.serviceId}`);
  }
}
