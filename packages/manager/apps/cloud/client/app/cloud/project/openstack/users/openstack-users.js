angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.openstack.users', {
    url: '/users',
    sticky: true,
    views: {
      cloudProjectOpenstack: {
        templateUrl: 'app/cloud/project/openstack/users/openstack-users.html',
        controller: 'CloudProjectOpenstackUsersCtrl',
        controllerAs: 'CloudProjectOpenstackUsersCtrl',
      },
    },
    translations: {
      value: ['.', './token', './openrc', './rclone'],
      format: 'json',
    },
  });
});
