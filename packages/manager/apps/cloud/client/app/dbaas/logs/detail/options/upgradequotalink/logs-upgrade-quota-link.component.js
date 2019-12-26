angular.module('managerApp').component('logsUpgradeQuotaLink', {
  templateUrl:
    'app/dbaas/logs/detail/options/upgradequotalink/logs-upgrade-quota-link.html',
  controller: 'logsUpgradeQuotaLinkCtrl',
  controllerAs: 'ctrl',
  bindings: {
    text: '@',
  },
});
