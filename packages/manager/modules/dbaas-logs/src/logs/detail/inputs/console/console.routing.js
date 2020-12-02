export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.inputs.input.console', {
    url: '/console',
    component: 'dbaasLogsDetailInputsConsole',
    resolve: {
    },
  });
};
