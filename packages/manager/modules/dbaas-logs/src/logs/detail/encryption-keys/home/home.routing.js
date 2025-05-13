export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.encryption-keys.home', {
    url: '/home',
    views: {
      logsEncryptionKeys: 'dbaasLogsDetailEncryptionKeysHome',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('logs_encryption_keys_title'),
      goToHomePage: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('dbaas-logs.detail', {
          serviceName,
        }),
      goToAddPage: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('dbaas-logs.detail.encryption-keys.add', {
          serviceName,
        }),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
    },
  });
};
