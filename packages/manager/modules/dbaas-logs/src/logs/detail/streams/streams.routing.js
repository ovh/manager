export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams', {
    url: '/streams',
    redirectTo: 'dbaas-logs.detail.streams.home',
    views: {
      logsContent: 'dbaasLogsDetailStreams',
    },
  });

  $stateProvider.state('dbaas-logs.detail.streams.stream', {
    url: '/:streamId',
    redirectTo: 'dbaas-logs.detail.streams',
    views: {
      logsStreams: {
        template: '<div ui-view></div>',
      },
    },
    resolve: {
      streamId: /* @ngInject */ ($transition$) =>
        $transition$.params().streamId,
    },
  });
};
