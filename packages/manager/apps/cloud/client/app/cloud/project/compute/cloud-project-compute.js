angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute', {
    url: '/compute',
    // abstract : true,
    views: {
      cloudProject: {
        //= cloudProject@cloud-project.cloud-project-compute
        templateUrl: 'app/cloud/project/compute/cloud-project-compute.html',
        controller: 'CloudProjectComputeCtrl',
        controllerAs: 'CloudProjectComputeCtrl',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
    atInternet: { ignore: true },
    params: {
      // Force the small display for large projects
      forceLargeProjectDisplay: false,
      createNewVm: false,
    },
  });
});
