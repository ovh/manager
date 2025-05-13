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
        goBack: /* @ngInject */ (goToNutanixNode) => goToNutanixNode,
        handleSuccess: /* @ngInject */ (
          $rootScope,
          serviceName,
          nodeId,
          goBack,
        ) => (message, name) => {
          $rootScope.$broadcast('global_display_name_change', {
            stateParams: {
              serviceName,
              nodeId,
            },
            displayName: name,
          });
          goBack(message);
        },
        breadcrumb: () => null,
      },
      atInternet: {
        rename:
          'hpc::nutanix::dashboard::nodes::node::general-info::edit-display-name',
      },
    },
  );
};
