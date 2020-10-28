export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('dbaas-logs.detail.inputs.addwizard', {
      url: '/input',
      redirectTo: 'dbaas-logs.detail.inputs.addwizard.add',
      views: {
        logsInputs: 'dbaasLogsDetailInputsAdd',
      },
    })
    .state('dbaas-logs.detail.inputs.editwizard', {
      url: '/input/:inputId',
      redirectTo: 'dbaas-logs.detail.inputs.editwizard.edit',
      views: {
        logsInputs: 'dbaasLogsDetailInputsAdd',
      },
    });
};
