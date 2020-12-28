export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.inputs.home', {
    url: '/home',
    views: {
      logsInputs: 'dbaasLogsDetailInputsHome',
    },
  });
};
