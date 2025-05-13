import template from './logs-home-account.html';

export default class LogsHomeAccountModalCtrl {
  /* @ngInject */
  constructor($scope, $state, $stateParams, CucControllerHelper) {
    this.$scope = $scope;
    this.$state = $state;
    this.serviceName = $stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.openModal();
  }

  openModal() {
    this.CucControllerHelper.modal
      .showModal({
        modalConfig: {
          template,
          controller: 'LogsHomeAccountCtrl',
          controllerAs: 'ctrl',
          backdrop: 'static',
        },
      })
      .finally(() => this.onCloseModal());
  }

  onCloseModal() {
    this.$state.go(
      'dbaas-logs.detail.home',
      {
        serviceName: this.serviceName,
      },
      { reload: true },
    );
  }
}
