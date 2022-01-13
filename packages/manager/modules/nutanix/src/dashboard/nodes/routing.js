export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes', {
    url: '/nodes',
    redirectTo: 'nutanix.dashboard.nodes.all',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_dashboard_nodes'),
    },
  });
};
