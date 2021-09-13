export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'nutanix.dashboard.nodes.node.general-info.install.gabarit',
    {
      url: '/gabarit',
      component: 'nutanixNodeServerInstallGabarit',
      params: {
        installSource: null,
      },
      redirectTo: ($transition$) => {
        if ($transition$.params().installSource === null) {
          return {
            state:
              'nutanix.dashboard.nodes.node.general-info.install.choose-source',
          };
        }
        return null;
      },
      resolve: {
        goBack: /* @ngInject */ (goToNutanixNode) => goToNutanixNode,
        installSource: /* @ngInject */ ($transition$) =>
          $transition$.params().installSource,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('nutanix_node_server_install_gabarit_title'),
      },
    },
  );
};
