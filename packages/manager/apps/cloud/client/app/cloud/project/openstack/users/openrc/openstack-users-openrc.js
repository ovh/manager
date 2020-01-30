angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.compute.openstack.users.openrc', {
    url: '/openrc',
    templateUrl:
      'app/cloud/project/openstack/users/openrc/openstack-users-openrc.html',
    controller: 'OpenstackUsersOpenrcCtrl',
    controllerAs: 'OpenstackUsersOpenrcCtrl',
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
