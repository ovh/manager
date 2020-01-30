angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('deskaas.details.upgrade', {
    url: '/upgrade',
    templateUrl: 'app/deskaas/deskaas-upgrade/deskaas-upgrade.html',
    controller: 'DeskaasUpgradeCtrl',
    controllerAs: 'DeskaasUpgradeCtrl',
  });
});
