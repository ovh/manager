export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('dbaas-logs.detail.inputs.addwizard.add', {
      url: '/add',
      views: {
        logsInputsAdd: 'dbaasLogsDetailInputsAddEdit',
      },
    })
    .state('dbaas-logs.detail.inputs.editwizard.edit', {
      url: '/details',
      views: {
        logsInputsAdd: 'dbaasLogsDetailInputsAddEdit',
      },
    });
};
