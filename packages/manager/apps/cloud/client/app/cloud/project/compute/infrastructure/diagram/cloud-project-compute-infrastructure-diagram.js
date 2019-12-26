angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.infrastructure.diagram', {
    url: '/diagram',
    views: {
      cloudProjectComputeInfrastructure: {
        templateUrl:
          'app/cloud/project/compute/infrastructure/diagram/cloud-project-compute-infrastructure-diagram.html',
        controller: 'CloudProjectComputeInfrastructureDiagramCtrl',
        controllerAs: 'ComputeInfrastructureDiagramCtrl',
        noTranslations: true,
      },
    },
    translations: {
      value: ['../../../billing/vouchers/addCredit', '../../regions'],
      format: 'json',
    },
  });
});
