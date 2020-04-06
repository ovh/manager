export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.offer', {
    url: '/offer',
    views: {
      logsContent: 'dbaasLogsDetailOffer',
    },
  });
};
