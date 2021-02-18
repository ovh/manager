angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.loadbalancerConfigure', {
    url: '/:loadbalancerId/configure?validate',
    views: {
      cloudProjectCompute: {
        templateUrl:
          'app/cloud/project/compute/loadbalancer/configure/compute-loadbalancer-configure.html',
        controller: 'CloudProjectComputeLoadbalancerConfigureCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
});
