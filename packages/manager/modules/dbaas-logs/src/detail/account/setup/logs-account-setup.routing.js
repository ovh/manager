export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.setup', {
    url: '/setup',
    views: {
      logsContent: 'dbaasLogsDetailAccountSetup',
    },
  });
};
