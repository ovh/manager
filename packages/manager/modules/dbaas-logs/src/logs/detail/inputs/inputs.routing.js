export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.inputs', {
    url: '/inputs',
    redirectTo: 'dbaas-logs.detail.inputs.home',
    views: {
      logsContent: 'dbaasLogsDetailInputs',
    },
  });
};
