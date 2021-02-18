angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.infrastructure.iac-view', {
    url: '/iac/view',
    views: {
      cloudProjectComputeInfrastructure: {
        templateUrl:
          'app/cloud/project/compute/infrastructure/iac/view/cloud-project-compute-infrastructure-iac-view.html',
        controller: 'CloudProjectComputeInfrastructureIacViewCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
