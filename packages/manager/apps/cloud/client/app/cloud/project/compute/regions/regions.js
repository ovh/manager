angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.regions', {
    url: '/regions',
    views: {
      cloudProjectCompute: {
        templateUrl: 'app/cloud/project/compute/regions/regions.html',
        controller: 'RegionsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: {
      value: ['.', './../infrastructure/virtualMachine/add'],
      format: 'json',
    },
  });
});
