export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'anthos.dashboard.general-information';
  $stateProvider.state(stateName, {
    url: '',
    views: {
      anthosTenantView: 'anthosDashboardGeneralInformation',
    },
    resolve: {
      breadcrumb: () => false,

      goBack: /* @ngInject */ ($state, goToTenant) => (message, type) =>
        goToTenant(message, type, $state.$current.parent.name),

      goToRenameService: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('anthos.dashboard.general-information.rename-service', {
          serviceName,
        }),

      goToOrderPublicIp: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.order-public-ip'),

      goToAssignPrivateIp: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.assign-private-ip'),
    },
  });
};
