import keys from 'lodash/keys';

export default class VeeamCloudConnectCtrl {
  /* @ngInject */
  constructor($filter, $q, $scope, $stateParams, VeeamCloudConnectService) {
    this.$filter = $filter;
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.VeeamCloudConnectService = VeeamCloudConnectService;
  }

  $onInit() {
    this.loadData();

    this.pendingTasksMessages = {};
    this.$scope.$watch(
      () => this.VeeamCloudConnectService.unitOfWork.tasks.length,
      () => {
        this.pendingTasksMessages = this.VeeamCloudConnectService.getPendingTasksMessages();
      },
    );
  }

  hasTaskMessages() {
    return keys(this.pendingTasksMessages).length > 0;
  }

  loadData() {
    this.VeeamCloudConnectService.unitOfWork.init();
    this.VeeamCloudConnectService.startPolling(this.$stateParams.serviceName);
  }
}
