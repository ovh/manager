export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.dashboard.netboot', {
    url: '/netboot',
    views: {
      '@app.dedicated-cluster': {
        component: 'dedicatedClusterNodeNetboot',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('server_configuration_netboot_title'),
    },
  });
};
