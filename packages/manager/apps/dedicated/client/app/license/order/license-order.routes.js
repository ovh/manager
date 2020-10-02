angular
  .module('Module.license')
  .config(($stateProvider) => {
  $stateProvider.state('app.license.order', {
    url: '/order',
    templateUrl: 'license/order/license-order.html',
    controller: 'LicenseOrderCtrl',
    translations: { value: ['..'], format: 'json' },
  });
});
