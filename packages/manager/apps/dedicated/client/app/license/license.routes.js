angular
  .module('Module.license')
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('app.license', {
      url: '/license',
      template: '<ui-view/>',
      redirectTo: 'app.license.dashboard',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('license_dashboard_title'),
      },
    });

    $stateProvider.state('app.license.dashboard', {
      url: '',
      templateUrl: 'license/license.html',
      controller: 'LicenseCtrl',
      resolve: {
        hideBreadcrumb: () => true,
      },
    });

    $urlRouterProvider.when(/^\/configuration\/license/, () => {
      window.location.href = window.location.href.replace('/configuration', '');
    });
  });
