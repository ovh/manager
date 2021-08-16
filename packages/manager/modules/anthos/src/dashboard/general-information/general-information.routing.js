export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'anthos.dashboard.general-information';
  $stateProvider.state(stateName, {
    url: '',
    views: {
      anthosTenantView: 'anthosDashboardGeneralInformation',
    },
    resolve: {
      breadcrumb: () => false,

      goBack: /* @ngInject */ (tenant, goToTenant) => (message, type) =>
        goToTenant(tenant, message, type),

      goToRenameService: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('anthos.dashboard.general-information.rename-service', {
          serviceName,
        }),
    },
  });
};
