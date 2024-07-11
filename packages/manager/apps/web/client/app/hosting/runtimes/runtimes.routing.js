import template from './RUNTIMES.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.runtimes', {
    url: '/runtimes',
    controller: 'HostingRuntimesCtrl',
    controllerAs: '$ctrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_dashboard_runtimes'),
    },
  });
};
