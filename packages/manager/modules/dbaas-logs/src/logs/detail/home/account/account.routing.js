export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.home.account', {
    url: '/account',
    views: {
      logsAccountContent: 'dbaasLogsDetailHomeAccount',
    },
  });
};
