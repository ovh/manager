export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.inputs.console', {
    url: '/:inputId/console',
    views: {
      logsInputs: 'dbaasLogsDetailInputsConsole',
    },
  });
};
