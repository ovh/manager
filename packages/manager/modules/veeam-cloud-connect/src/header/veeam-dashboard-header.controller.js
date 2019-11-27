export default class VeeamCloudConnectDashboardHeaderCtrl {
  /* @ngInject */
  constructor($state, $stateParams) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = $stateParams.serviceName;
  }
}
