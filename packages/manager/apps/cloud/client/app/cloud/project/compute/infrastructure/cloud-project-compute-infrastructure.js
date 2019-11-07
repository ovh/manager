angular.module('managerApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.infrastructure', {
        url: '/infrastructure?openVncWithId',
        sticky: true,
        views: {
          cloudProjectCompute: {
            templateUrl: 'app/cloud/project/compute/infrastructure/cloud-project-compute-infrastructure.html',
            controller: 'CloudProjectComputeInfrastructureCtrl',
            controllerAs: 'CloudProjectComputeInfrastructureCtrl',
          },
        },
        params: {
          openVncWithId: { value: null },
          // true to indicate that we want to display the add volume popover
          createNewVolume: false,
          // pass snapshot data to display restore volume popover
          createNewVolumeFromSnapshot: { snapshot: null },
          // true to indicate that we want to display the add VM popover
          createNewVm: false,
          editVm: null,
          monitorVm: null,
          hTerm: null,
        },
        translations: {
          value: [
            '../snapshot/add',
            '../volume/snapshot',
            '.',
            './ip/failover/import',
            './ip/failover/buy',
            './volume',
            './volume/addEdit',
            './virtualMachine/addEdit',
            './virtualMachine/delete',
            './virtualMachine/vnc',
            './virtualMachine/rescue',
            './virtualMachine/monthlyConfirm',
            './virtualMachine/monitoring',
            './virtualMachine/loginInformation',
            './privateNetwork',
            './privateNetwork/dialog',
            './privateNetwork/delete',
            '../../delete',
            '../../rename',
            './openstackClient',
            '../../regions',
          ],
          format: 'json',
        },
      });
  });
