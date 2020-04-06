export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.options.manage', {
    url: '/manage',
    views: {
      logsOptions: 'dbaasLogsDetailOptionsManage',
    },
  });
};
