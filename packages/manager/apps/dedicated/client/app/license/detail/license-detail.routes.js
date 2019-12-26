angular.module('Module.license').config(($stateProvider) => {
  $stateProvider.state('app.license.detail', {
    url: '/:licenseId/detail',
    templateUrl: 'license/detail/license-detail.html',
    controller: 'LicenseDetailsCtrl',
    translations: { value: ['..'], format: 'json' },
  });
});
