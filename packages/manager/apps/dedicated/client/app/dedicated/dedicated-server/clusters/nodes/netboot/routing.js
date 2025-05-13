export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.dashboard.netboot', {
    url: '/netboot',
    views: {
      'rootView@app.dedicated-cluster': {
        component: 'dedicatedClusterNodeNetboot',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToServerDetails) => (
        message,
        type = 'DONE',
        reload = true,
      ) => goToServerDetails(message, type, reload),
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('server_configuration_netboot_title'),
    },
  });
};
