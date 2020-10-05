export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.tokens.add', {
    url: '/add',
    views: {
      logsTokensAdd: 'dbaasLogsDetailTokensAdd',
    },
  });
};
