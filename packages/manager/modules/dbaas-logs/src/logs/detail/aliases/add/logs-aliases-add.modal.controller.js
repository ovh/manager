import template from './logs-aliases-add.html';

export default class LogsAliasesAddModalCtrl {
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
          controller: 'LogsAliasesAddCtrl',
          controllerAs: 'ctrl',
          backdrop: 'static',
        },
      })
      .finally(() => this.onCloseModal());
  }

  onCloseModal() {
    this.$state.go('dbaas-logs.detail.aliases');
  }
}
