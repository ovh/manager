export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.dashboard.install', {
    abstract: true,
    url: '/install',
    resolve: {
      goDashboard: /* @ngInject */ ($state) => () =>
        $state.go(
          'app.dedicated-cluster.cluster.node.dashboard',
          {},
          {
            reload: true,
          },
        ),

      hardwareSpecifications: /* @ngInject */ (
        dedicatedServerInstall,
        server,
      ) => dedicatedServerInstall.getHardwareSpecifications(server),
    },
  });
};
