angular
  .module('Module.license')
  .config(($stateProvider) => {
    $stateProvider.state('app.license.detail.upgrade', {
      url: '/upgrade',
    templateUrl: 'license/upgrade/license-upgrade.html',
    controller: 'LicenseUpgradeCtrl',
    translations: { value: ['..'], format: 'json' },
  });
});
