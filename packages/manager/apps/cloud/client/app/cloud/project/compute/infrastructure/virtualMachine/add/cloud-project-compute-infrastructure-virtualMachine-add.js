angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.infrastructure.vm-add', {
    url: '/vm/add',
    views: {
      cloudProjectComputeInfrastructure: {
        templateUrl:
          'app/cloud/project/compute/infrastructure/virtualMachine/add/cloud-project-compute-infrastructure-virtualMachine-add.html',
        controller: 'CloudProjectComputeInfrastructureVirtualMachineAddCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: {
      value: ['.', '../../../regions'],
      format: 'json',
    },
  });
});
