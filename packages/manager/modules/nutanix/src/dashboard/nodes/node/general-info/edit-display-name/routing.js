export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'nutanix.dashboard.nodes.node.general-info.edit-display-name',
    {
      url: '/edit-display-name',
      views: {
        modal: {
          component: 'nutanixNodeGeneralInfoEditDisplayName',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToNutanixNodeServer) =>
          goToNutanixNodeServer,
        breadcrumb: () => null,
      },
    },
  );
};
