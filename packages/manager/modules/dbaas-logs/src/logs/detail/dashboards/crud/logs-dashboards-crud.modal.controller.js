import template from './logs-dashboards-crud.html';

export default class LogsDashboardsCrudModalCtrl {
  /* @ngInject */
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
          template,
          controller: 'LogsDashboardsCrudCtrl',
          controllerAs: 'ctrl',
          backdrop: 'static',
        },
      })
      .then(() => this.$scope.$parent.ctrl.initLoaders())
      .finally(() => this.onCloseModal());
  }

  onCloseModal() {
    this.$state.go('dbaas-logs.detail.dashboards');
  }
}
