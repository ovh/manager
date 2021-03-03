angular.module('Module.license').config(($stateProvider) => {
  $stateProvider.state('app.license.detail', {
    url: '/:licenseId',
    templateUrl: 'license/detail/license-detail.html',
    controller: 'LicenseDetailsCtrl',
    translations: { value: ['..'], format: 'json' },
    resolve: {
      licenseId: /* @ngInject */ ($transition$) =>
        $transition$.params().licenseId,
      breadcrumb: /* @ngInject */ (licenseId) => licenseId,
    },
  });

  $stateProvider.state('app.license.detail.redirection', {
    url: '/detail',
    redirectTo: 'app.license.detail',
  });
});
