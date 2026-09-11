// Hiding a button never stops a typed address, and this is the only
// bookmarkable legacy write address in the module.
const redirectTo = (transition) =>
  transition
    .injector()
    .getAsync('legacyAccess')
    .then(({ isDecommissioned }) =>
      isDecommissioned ? 'dbaas-logs.detail.tokens' : false,
    );

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.tokens.add', {
    url: '/add',
    redirectTo,
    views: {
      logsTokensAdd: 'dbaasLogsDetailTokensAdd',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
