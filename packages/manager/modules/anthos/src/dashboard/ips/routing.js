export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.ips', {
    url: '/ips',
    views: {
      anthosTenantView: 'anthosIPs',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('anthos_dashboard_header_storage'),

      removePrivateIpLink: /* @ngInject */ ($state, serviceName) => (
        privateIp,
      ) => {
        return $state.href('anthos.dashboard.ips.remove-private-ip', {
          serviceName,
          privateIp,
        });
      },

      goBack: /* @ngInject */ ($state, goToTenant) => (message, type) =>
        goToTenant(message, type, $state.$current.parent.name),

      goToOrderPublicIp: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.ips.order-public-ip'),

      goToAssignPrivateIp: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.ips.assign-private-ip'),

      goToRemovePrivateIp: /* @ngInject */ ($state) => (privateIp) =>
        $state.go('anthos.dashboard.ips.remove-private-ip', {
          privateIp,
        }),
    },
  });
};
