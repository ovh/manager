export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.edit', {
    url: '/edit',
    component: 'dbaasLogsDetailStreamsAdd',
  });
};
