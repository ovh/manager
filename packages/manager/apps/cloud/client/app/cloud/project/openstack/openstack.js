angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.openstack', {
    url: '/openstack',
    views: {
      cloudProjectCompute: {
        templateUrl: 'app/cloud/project/openstack/openstack.html',
        controller: 'CloudProjectOpenstackCtrl',
        controllerAs: 'CloudProjectOpenstackCtrl',
      },
    },
    redirectTo: 'iaas.pci-project.compute.openstack.users',
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
