angular
  .module('Module.license')
  .config(($stateProvider) => {
    $stateProvider.state('app.license.order', {
      url: '/order',
      templateUrl: 'license/order/license-order.html',
      controller: 'LicenseOrderCtrl',
      translations: { value: ['..'], format: 'json' },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('license_order'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
