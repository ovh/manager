export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.encryption-keys.add', {
    url: '/add',
    views: {
      logsEncryptionKeys: 'dbaasLogsDetailEncryptionKeysAdd',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('logs_encryption_keys_add'),
      goToEncryptionKeysHomePage: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('dbaas-logs.detail.encryption-keys.home', {
          serviceName,
        }),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
    },
  });
};
