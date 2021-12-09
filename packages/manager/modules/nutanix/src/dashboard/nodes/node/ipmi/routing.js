export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node.ipmi', {
    url: '/ipmi',
    views: {
      serverView: 'nutanixNodeIpmi',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => 'IPMI',
    },
    atInternet: {
      rename: 'hpc::nutanix::cluster::node::ipmi',
    },
  });
};
