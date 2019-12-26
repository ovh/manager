class LogsDashboardsCrudModalCtrl {
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
            'app/dbaas/logs/detail/dashboards/crud/logs-dashboards-crud.html',
          controller: 'LogsDashboardsCrudCtrl',
          controllerAs: 'ctrl',
          backdrop: 'static',
        },
      })
      .then(() => this.$scope.$parent.ctrl.initLoaders())
      .finally(() => this.onCloseModal());
  }

  onCloseModal() {
    this.$state.go('dbaas.logs.detail.dashboards');
  }
}

angular
  .module('managerApp')
  .controller('LogsDashboardsCrudModalCtrl', LogsDashboardsCrudModalCtrl);
