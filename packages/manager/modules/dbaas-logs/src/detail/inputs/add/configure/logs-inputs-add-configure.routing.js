export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.inputs.editwizard.configure', {
    url: '/configure',
    views: {
      logsInputsAdd: 'dbaasLogsDetailInputsAddConfigure',
    },
  });
};
