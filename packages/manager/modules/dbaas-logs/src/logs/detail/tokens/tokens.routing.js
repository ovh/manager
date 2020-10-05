export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.tokens', {
    url: '/tokens',
    views: {
      logsContent: 'dbaasLogsDetailTokens',
    },
  });
};
