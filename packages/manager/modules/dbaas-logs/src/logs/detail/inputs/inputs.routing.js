export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('dbaas-logs.detail.inputs', {
      url: '/inputs',
      redirectTo: 'dbaas-logs.detail.inputs.home',
      views: {
        logsContent: 'dbaasLogsDetailInputs',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dbaas_logs_inputs'),
      },
    })
    .state('dbaas-logs.detail.inputs.input', {
      url: '/:inputId',
      redirectTo: 'dbaas-logs.detail.inputs',
      views: {
        logsInputs: {
          template: '<div ui-view></div>',
        },
      },
      resolve: {
        inputId: /* @ngInject */ ($transition$) =>
          $transition$.params().inputId,
        breadcrumb: /* @ngInject */ (inputId) => inputId,
      },
    });
};
