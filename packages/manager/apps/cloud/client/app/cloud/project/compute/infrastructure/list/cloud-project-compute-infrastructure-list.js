angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.infrastructure.list', {
    url: '/list',
    views: {
      cloudProjectComputeInfrastructure: {
        templateUrl:
          'app/cloud/project/compute/infrastructure/list/cloud-project-compute-infrastructure-list.html',
        controller: 'CloudProjectComputeInfrastructureListCtrl',
        controllerAs: 'ComputeInfrastructureListCtrl',
      },
    },
    translations: {
      value: ['../../../billing/vouchers/addCredit'],
      format: 'json',
    },
  });
});
