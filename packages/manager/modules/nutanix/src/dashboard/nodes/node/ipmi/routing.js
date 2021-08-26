export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node.ipmi', {
    url: '/ipmi',
    component: 'nutanixNodeIpmi',
    resolve: {
      breadcrumb: /* @ngInject */ () => 'IPMI',
    },
  });
};
