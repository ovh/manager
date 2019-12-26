angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.snapshot', {
    url: '/snapshot',
    sticky: true,
    views: {
      cloudProjectCompute: {
        templateUrl:
          'app/cloud/project/compute/snapshot/cloud-project-compute-snapshot.html',
        controller: 'CloudProjectComputeSnapshotCtrl',
        controllerAs: 'CloudProjectComputeSnapshotCtrl',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
