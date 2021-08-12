export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node.general-info.install', {
    abstract: true,
    url: '/install',
    resolve: {
      goDashboard: /* @ngInject */ ($state) => () =>
        $state.go(
          'nutanix.dashboard.nodes.node.general-info',
          {},
          {
            reload: false,
          },
        ),
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
      hardwareSpecifications: /* @ngInject */ (
        nutanixNodeServerInstall,
        server,
      ) => nutanixNodeServerInstall.getHardwareSpecifications(server),
    },
  });
};
