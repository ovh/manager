import LogConstants from './logs-constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs', {
    component: 'dbaasLogs',
    url: '/dbaas/logs',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: `${LogConstants.TRACKING_PREFIX}::${hit}`,
          type: 'action',
        });
      },
      logs: /* @ngInject */ (OvhApiDbaas) =>
        OvhApiDbaas.Logs()
          .v6()
          .query().$promise,
      me: /* @ngInject */ ($http) =>
        $http
          .get('/me')
          .then(({ data }) => data)
          .catch(() => {}),
      orderLink: /* @ngInject */ ($state) => $state.href('dbaas-logs.order'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs'),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('logs')
        .then((results) =>
          results.length === 0 ? 'dbaas-logs.onboarding' : 'dbaas-logs.list',
        ),
  });
};
