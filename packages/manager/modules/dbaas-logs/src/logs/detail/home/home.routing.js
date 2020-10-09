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
          : LogsTokensService.getTokensIds(serviceName),
      defaultCluster: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsTokensService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when({})
          : LogsTokensService.getDefaultCluster(serviceName),
      streamData: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsConstants,
        LogsHomeService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when(null)
          : LogsHomeService.getDataUsage(
              serviceName,
              LogsConstants.DATA_STORAGE.METRICS.STREAM_SIZE,
            ),
      archiveData: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsConstants,
        LogsHomeService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when(null)
          : LogsHomeService.getDataUsage(
              serviceName,
              LogsConstants.DATA_STORAGE.METRICS.COLD_STORAGE_TOTAL,
            ),
      indiceData: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsConstants,
        LogsHomeService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when(null)
          : LogsHomeService.getDataUsage(
              serviceName,
              LogsConstants.DATA_STORAGE.METRICS.INDEX_SIZE,
            ),
      indexIds: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsIndexService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when(null)
          : LogsIndexService.getIndicesIds(serviceName),
      aliasIds: /* @ngInject */ (
        $q,
        isAccountDisabled,
        LogsAliasesService,
        serviceName,
      ) =>
        isAccountDisabled
          ? $q.when(null)
          : LogsAliasesService.getAliasesIds(serviceName),
    },
  });
};
