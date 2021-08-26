export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes', {
    url: '/nodes',
    component: 'nutanixNodes',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_dashboard_nodes'),
    },
  });
};
