export default class VeeamCloudConnectDashboardHeaderCtrl {
  /* @ngInject */
  constructor($state, $stateParams, constants) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = $stateParams.serviceName;
    this.constants = constants;
  }
}
