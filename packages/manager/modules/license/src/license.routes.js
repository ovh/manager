import dashboardTemplate from './license.html';
import dashboardCtrl from './license.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('license', {
    url: '/license',
    redirectTo: 'license.dashboard',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('license_dashboard_title'),
    },
  });

  $stateProvider.state('license.dashboard', {
    url: '',
    template: dashboardTemplate,
    controller: dashboardCtrl,
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
