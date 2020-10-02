angular
  .module('Module.license')
  .config(($stateProvider) => {
    $stateProvider.state('app.license.detail.upgrade', {
      url: '/upgrade',
      templateUrl: 'license/upgrade/license-upgrade.html',
      controller: 'LicenseUpgradeCtrl',
      translations: { value: ['..'], format: 'json' },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('license_upgrade'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
