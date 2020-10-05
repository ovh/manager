import template from './logs-token-add.html';

export default class LogsTokenAddModalCtrl {
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
          controller: 'LogsTokenAddCtrl',
          controllerAs: 'ctrl',
        },
      })
      .then(() => this.$scope.$parent.ctrl.initLoaders())
      .finally(() => this.onCloseModal());
  }

  onCloseModal() {
    this.$state.go('dbaas-logs.detail.tokens');
  }
}
