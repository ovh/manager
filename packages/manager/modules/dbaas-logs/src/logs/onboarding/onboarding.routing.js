export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.onboarding', {
    url: '/onboarding',
    views: {
      logsHeader: 'dbaasLogsListHeader',
      logsContainer: 'dbaasLogsOnboarding',
    },
  });
};
