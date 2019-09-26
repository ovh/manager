(() => {
  class VeeamDashboardHeaderCtrl {
    constructor($state, $stateParams) {
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.serviceName = $stateParams.serviceName;
    }
  }
  angular.module('managerApp').controller('VeeamDashboardHeaderCtrl', VeeamDashboardHeaderCtrl);
})();
