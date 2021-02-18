angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    /**
     * NEW PROJECT
     * #/cloud/project/new (see "add" folder)
     */

    .state('iaas.pci-project-new', {
      url: '/pci/project/new',
      templateUrl: 'app/cloud/project/add/cloud-project-add.html',
      controller: 'CloudProjectAddCtrl',
      controllerAs: 'CloudProjectAddCtrl',
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
});
