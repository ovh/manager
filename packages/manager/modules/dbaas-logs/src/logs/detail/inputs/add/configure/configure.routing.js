export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.inputs.input.editwizard.configure', {
    url: '/configure',
    views: {
      logsInputsAdd: 'dbaasLogsDetailInputsAddConfigure',
    },
  });
};
