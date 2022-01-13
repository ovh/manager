export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node.general-info.reboot', {
    url: '/reboot',
    views: {
      modal: {
        component: 'nutanixNodeReboot',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToNutanixNode) => goToNutanixNode,
      breadcrumb: /* @ngInject */ () => null,
      trackingPrefix: /* @ngInject */ () =>
        'hpc::nutanix::cluster::node::reboot',
    },
    atInternet: {
      rename: 'hpc::nutanix::cluster::node::reboot',
    },
  });
};
