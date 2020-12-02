export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('dbaas-logs.detail.inputs.addwizard', {
      url: '/input',
      redirectTo: 'dbaas-logs.detail.inputs.addwizard.add',
      views: {
        logsInputs: 'dbaasLogsDetailInputsAdd',
      },
    })
    .state('dbaas-logs.detail.inputs.input.editwizard', {
      url: '/edit',
      redirectTo: 'dbaas-logs.detail.inputs.input.editwizard.edit',
      component: 'dbaasLogsDetailInputsAdd',
      resolve: {
      },
    });
};
