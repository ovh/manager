import template from './CRON.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cron', {
    url: '/cron',
    template,
    controller: 'HostingCronsCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_cron'),
    },
  });
};
