export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.home.capped', {
    url: '/capped',
    views: {
      logsCappedContent: 'dbaasLogsDetailHomeCapped',
    },
  });
};
