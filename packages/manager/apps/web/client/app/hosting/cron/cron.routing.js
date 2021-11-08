import template from './CRON.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cron', {
    url: '/cron',
    template,
    controller: 'HostingCronsCtrl',
    controllerAs: '$ctrl',

    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_cron'),
    },
  });
};
