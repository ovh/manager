export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.home', {
    url: '/home',
    views: {
      logsContent: 'dbaasLogsDetailHome',
    },
    resolve: {
      accountDetails: /* @ngInject */ (LogsHomeService, serviceName) =>
        LogsHomeService.getAccountDetails(serviceName),
      serviceInfos: /* @ngInject */ (LogsHomeService, serviceName) =>
        LogsHomeService.getServiceInfos(serviceName),
      tokenIds: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsTokensService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when([])
          : LogsTokensService.getTokenIds(serviceName),
      defaultCluster: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsTokensService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when({})
          : LogsTokensService.getDefaultCluster(serviceName),
      dataUsage: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsHomeService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when(null)
          : LogsHomeService.getDataUsage(serviceName),
      indexIds: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsIndexService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when(null)
          : LogsIndexService.getIndiceIds(serviceName),
      aliasIds: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsAliasesService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when(null)
          : LogsAliasesService.getAliasIds(serviceName),
      goToResiliate: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('dbaas-logs.detail.home.resiliate', { serviceName }),
      encryptionKeysIds: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsEncryptionKeysService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when(null)
          : LogsEncryptionKeysService.getEncryptionKeysIds(serviceName),
      breadcrumb: () => null,
    },
  });
};
