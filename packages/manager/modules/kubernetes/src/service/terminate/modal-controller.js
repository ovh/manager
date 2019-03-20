import controller from './controller';
import template from './template.html';

export default class kubernetesTerminateModalCtrl {
  /* @ngInject */
  constructor($scope, $state, $stateParams, CucControllerHelper) {
    this.$scope = $scope;
    this.$state = $state;
    this.serviceName = $stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.openModal();
  }

  openModal() {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template,
        controller,
        controllerAs: '$ctrl',
        backdrop: 'static',
      },
    }).finally(() => this.onCloseModal());
  }

  onCloseModal() {
    this.$state.go('kube.service', {
      serviceName: this.serviceName,
    });
    this.$scope.$broadcast('kube.service.refresh');
  }
}
