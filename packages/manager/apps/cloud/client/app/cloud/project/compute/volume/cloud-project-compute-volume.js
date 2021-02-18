angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.volume', {
    url: '/volume',
    sticky: true,
    views: {
      cloudProjectCompute: {
        templateUrl:
          'app/cloud/project/compute/volume/cloud-project-compute-volume.html',
        controller: 'CloudProjectComputeVolumeCtrl',
        controllerAs: 'CloudProjectComputeVolumeCtrl',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
