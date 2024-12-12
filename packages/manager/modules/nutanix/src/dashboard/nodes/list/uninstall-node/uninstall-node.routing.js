export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all.uninstall-node', {
    url: '/uninstall/:node',
    views: {
      modal: {
        component: 'uninstallNutanixNodeModal',
      },
    },
    layout: 'modal',
    resolve: {
      nodeId: /* @ngInject */ ($transition$) => $transition$.params().node,
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.nodes.all'),
      handleSuccess: /* @ngInject */ (Alerter, goBack) => (message) => {
        Alerter.success(message, 'nutanix_dashboard_alert');
        goBack();
      },
      handleError: /* @ngInject */ (Alerter, goBack) => (message) => {
        Alerter.error(message, 'nutanix_dashboard_alert');
        goBack();
      },
      uninstallNode: /* ngInject */ (
        NutanixService,
        serviceName,
        nodeId,
      ) => () => NutanixService.uninstallClusterNode(serviceName, nodeId),
      userSubsidiary: /* ngInject */ (coreConfig) =>
        coreConfig.getUser().ovhSubsidiary,
    },
  });
};
