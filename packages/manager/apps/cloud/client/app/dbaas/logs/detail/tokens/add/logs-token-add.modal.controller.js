class LogsTokenAddModalCtrl {
  constructor($scope, $state, CucControllerHelper) {
    this.$scope = $scope;
    this.$state = $state;
    this.CucControllerHelper = CucControllerHelper;
    this.openModal();
  }

  openModal() {
    this.CucControllerHelper.modal
      .showModal({
        modalConfig: {
          templateUrl: 'app/dbaas/logs/detail/tokens/add/logs-token-add.html',
          controller: 'LogsTokenAddCtrl',
          controllerAs: 'ctrl',
        },
      })
      .then(() => this.$scope.$parent.ctrl.initLoaders())
      .finally(() => this.onCloseModal());
  }

  onCloseModal() {
    this.$state.go('dbaas.logs.detail.tokens');
  }
}

angular
  .module('managerApp')
  .controller('LogsTokenAddModalCtrl', LogsTokenAddModalCtrl);
