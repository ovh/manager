export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.ips', {
    url: '/ips',
    views: {
      anthosTenantView: 'anthosIPs',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('anthos_dashboard_header_storage'),

      goToDeletePrivateIp: /* @ngInject */ ($state) => (privateIp) =>
        $state.href('anthos.dashboard.ips.delete-private-ip', { privateIp }),
    },
  });
};
