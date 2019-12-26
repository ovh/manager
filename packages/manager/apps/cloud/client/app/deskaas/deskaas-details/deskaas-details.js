angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('deskaas.details', {
    url: '/:serviceName?action&token',
    templateUrl: 'app/deskaas/deskaas-details/deskaas-details.html',
    controller: 'DeskaasDetailsCtrl',
    controllerAs: '$ctrl',
    translations: {
      value: ['.'],
      format: 'json',
    },
    params: {
      followTask: null,
    },
  });
});
