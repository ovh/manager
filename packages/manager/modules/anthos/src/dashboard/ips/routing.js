export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.ips', {
    url: '/ips',
    views: {
      anthosTenantView: 'anthosIPs',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('anthos_dashboard_header_storage'),

      goBack: /* @ngInject */ ($state, goToTenant) => (message, type) =>
        goToTenant(message, type, $state.$current.parent.name),
    },
  });
};
