import controller from './controller';
import template from './template.html';

export default class kubernetesResetModalCtrl {
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
        controllerAs: 'ctrl',
        openedClass: 'kubernetes',
        backdrop: 'static',
      },
    }).finally(() => this.onCloseModal());
  }

  onCloseModal() {
    this.$state.go('pci.projects.project.kubernetes.details.service', {
      serviceName: this.serviceName,
    });
    this.$scope.$broadcast('pci.projects.project.kubernetes.details.service.refresh');
  }
}
