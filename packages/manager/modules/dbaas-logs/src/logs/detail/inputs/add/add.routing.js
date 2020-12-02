export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('dbaas-logs.detail.inputs.addwizard', {
      url: '/input',
      redirectTo: 'dbaas-logs.detail.inputs.addwizard.add',
      views: {
        logsInputs: 'dbaasLogsDetailInputsAdd',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dbaas_logs_inputs_add'),
      },
    })
    .state('dbaas-logs.detail.inputs.input.editwizard', {
      url: '/edit',
      redirectTo: 'dbaas-logs.detail.inputs.input.editwizard.edit',
      component: 'dbaasLogsDetailInputsAdd',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dbaas_logs_inputs_edit'),
      },
    });
};
