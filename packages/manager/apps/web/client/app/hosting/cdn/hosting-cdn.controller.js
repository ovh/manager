export default class HostingCdnController {
  /* @ngInject */
  constructor($stateParams, serviceName) {
    this.$stateParams = $stateParams;
    this.serviceName = serviceName;
  }
}
