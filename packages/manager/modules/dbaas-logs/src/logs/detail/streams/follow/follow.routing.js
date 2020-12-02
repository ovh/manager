export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.follow', {
    url: '/follow',
    component: 'dbaasLogsDetailStreamsFollow',
    resolve: {
    },
  });
};
