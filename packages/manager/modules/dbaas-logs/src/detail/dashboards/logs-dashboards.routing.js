export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.dashboards', {
    url: '/dashboards',
    views: {
      logsContent: 'dbaasLogsDetailDashboards',
    },
  });
};
