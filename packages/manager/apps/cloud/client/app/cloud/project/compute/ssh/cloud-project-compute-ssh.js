angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.ssh', {
    url: '/ssh',
    sticky: true,
    views: {
      cloudProjectCompute: {
        templateUrl:
          'app/cloud/project/compute/ssh/cloud-project-compute-ssh.html',
        controller: 'CloudProjectComputeSshCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
