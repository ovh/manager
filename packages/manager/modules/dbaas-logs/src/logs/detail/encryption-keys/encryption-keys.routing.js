export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.encryption-keys', {
    url: '/encryption-keys',
    redirectTo: 'dbaas-logs.detail.encryption-keys.home',
    views: {
      logsContent: 'dbaasLogsDetailEncryptionKeys',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
