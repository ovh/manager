angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.loadbalancer', {
    url: '/loadbalancer',
    sticky: true,
    views: {
      cloudProjectCompute: {
        templateUrl:
          'app/cloud/project/compute/loadbalancer/cloud-project-compute-loadbalancer.html',
        controller: 'CloudProjectComputeLoadbalancerCtrl',
        controllerAs: 'CloudProjectComputeLoadbalancerCtrl',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
