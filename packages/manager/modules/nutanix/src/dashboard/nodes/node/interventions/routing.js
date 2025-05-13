export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node.interventions', {
    url: '/interventions',
    views: {
      serverView: 'nutanixNodeInterventions',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_node_interventions'),
    },
    atInternet: {
      rename: 'hpc::nutanix::cluster::node::intervention',
    },
  });
};
