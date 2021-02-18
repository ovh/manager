angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('deskaas', {
    url: '/deskaas',
    templateUrl: 'app/deskaas/deskaas.html',
    controller: 'DeskaasCtrl',
    controllerAs: 'DeskaasCtrl',
    translations: {
      value: ['.', '../common'],
      format: 'json',
    },
  });
});
