angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.quota', {
    url: '/quota',
    views: {
      cloudProjectCompute: {
        templateUrl:
          'app/cloud/project/compute/quota/cloud-project-compute-quota.html',
        controller: 'CloudProjectComputeQuotaCtrl',
        controllerAs: 'CloudProjectComputeQuotaCtrl',
      },
    },
    translations: {
      value: ['.', '../regions'],
      format: 'json',
    },
  });
});
