import dashboardTemplate from './license.html';
import dashboardCtrl from './license.controller';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
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
    template: dashboardTemplate,
    controller: dashboardCtrl,
    resolve: {
      hideBreadcrumb: () => true,
    },
  });

  $urlRouterProvider.when(/^\/configuration\/license/, () => {
    window.location.href = window.location.href.replace('/configuration', '');
  });
};
