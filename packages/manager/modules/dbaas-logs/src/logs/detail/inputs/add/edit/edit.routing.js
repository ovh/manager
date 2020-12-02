export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.inputs.input.editwizard.edit', {
    url: '/details',
    views: {
      logsInputsAdd: 'dbaasLogsDetailInputsAddEdit',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
