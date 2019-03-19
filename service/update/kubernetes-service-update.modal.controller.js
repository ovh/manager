class kubernetesUpdateModalCtrl {
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
        templateUrl: 'app/kubernetes/service/update/kubernetes-service-update.html',
        controller: 'kubernetesUpdateCtrl',
        controllerAs: '$ctrl',
        backdrop: 'static',
      },
    }).finally(() => this.onCloseModal());
  }

  onCloseModal() {
    this.$state.go('paas.kube.service', {
      serviceName: this.serviceName,
    });
    this.$scope.$broadcast('kube.service.refresh');
  }
}

angular.module('managerApp').controller('kubernetesUpdateModalCtrl', kubernetesUpdateModalCtrl);
