(() => {
  class VeeamDetailCtrl {
    constructor($filter, $q, $scope, $stateParams, VeeamService) {
      this.$filter = $filter;
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.VeeamService = VeeamService;
    }

    $onInit() {
      this.loadData();

      this.pendingTasksMessages = {};
      this.$scope.$watch(() => this.VeeamService.unitOfWork.tasks.length, () => {
        this.pendingTasksMessages = this.VeeamService.getPendingTasksMessages();
      });
    }

    hasTaskMessages() {
      return _.keys(this.pendingTasksMessages).length > 0;
    }

    loadData() {
      this.VeeamService.unitOfWork.init();
      this.VeeamService.startPolling(this.$stateParams.serviceName);
    }
  }

  angular.module('managerApp').controller('VeeamDetailCtrl', VeeamDetailCtrl);
})();
