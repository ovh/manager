export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams', {
    url: '/streams',
    redirectTo: 'dbaas-logs.detail.streams.home',
    views: {
      logsContent: 'dbaasLogsDetailStreams',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_streams'),
    },
  });

  $stateProvider.state('dbaas-logs.detail.streams.stream', {
    url: '/:streamId',
    redirectTo: 'dbaas-logs.detail.streams',
    views: {
      'logsContent@dbaas-logs.detail': {
        template: '<div ui-view></div>',
      },
    },
    resolve: {
      streamId: /* @ngInject */ ($transition$) =>
        $transition$.params().streamId,
      breadcrumb: /* @ngInject */ (streamId) => streamId,
    },
  });
};
