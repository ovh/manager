angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas.pci-project.details', {
    url: '',
    views: {
      cloudProject: {
        templateUrl: 'app/cloud/project/details/cloud-project-details.html',
        controller: 'CloudProjectDetailsCtrl',
        controllerAs: 'CloudProjectDetailsCtrl',
      },
    },
    params: {
      fromProjectAdd: {
        // used in CloudProjectAddCtrl
        value: false,
        squash: true,
      },
      createNewVm: false,
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
