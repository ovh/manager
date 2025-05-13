export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.inputs.addwizard.add', {
    url: '/add',
    views: {
      logsInputsAdd: 'dbaasLogsDetailInputsAddEdit',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
