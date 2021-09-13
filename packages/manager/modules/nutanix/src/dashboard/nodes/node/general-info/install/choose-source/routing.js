export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'nutanix.dashboard.nodes.node.general-info.install.choose-source',
    {
      url: '/choose-source',
      component: 'nutanixNodeServerInstallChooseSource',
      resolve: {
        goBack: /* @ngInject */ (goToNutanixNode) => goToNutanixNode,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('nutanix_node_server_install_choose_source_title'),
      },
    },
  );
};
