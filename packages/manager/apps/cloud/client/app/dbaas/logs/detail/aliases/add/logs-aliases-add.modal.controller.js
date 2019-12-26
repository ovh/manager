class LogsAliasesAddModalCtrl {
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
          templateUrl:
            'app/dbaas/logs/detail/aliases/add/logs-aliases-add.html',
          controller: 'LogsAliasesAddCtrl',
          controllerAs: 'ctrl',
          backdrop: 'static',
        },
      })
      .then(() => this.$scope.$parent.ctrl.initLoaders())
      .finally(() => this.onCloseModal());
  }

  onCloseModal() {
    this.$state.go('dbaas.logs.detail.aliases');
  }
}

angular
  .module('managerApp')
  .controller('LogsAliasesAddModalCtrl', LogsAliasesAddModalCtrl);
