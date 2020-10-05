export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.aliases.link', {
    url: '/:aliasId/link',
    params: {
      defaultContent: null,
    },
    views: {
      logsAliases: 'dbaasLogsDetailAliasesLink',
    },
  });
};
