export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'nutanix.dashboard.nodes.node.general-info.edit-display-name',
    {
      url: '/edit-display-name',
      component: 'nutanixNodeGeneralInfoEditDisplayName',
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToNutanixNode) => goToNutanixNode,
        breadcrumb: () => null,
      },
    },
  );
};
