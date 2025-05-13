export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.inputs.input.editwizard.configure', {
    url: '/configure/:exposedPort',
    views: {
      logsInputsAdd: 'dbaasLogsDetailInputsAddConfigure',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_inputs_configure'),
    },
  });
};
