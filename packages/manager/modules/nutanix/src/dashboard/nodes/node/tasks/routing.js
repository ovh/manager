export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node.tasks', {
    url: '/tasks',
    views: {
      serverView: 'nutanixNodeTasks',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_node_tasks'),
    },
    atInternet: {
      rename: 'hpc::nutanix::cluster::node::task',
    },
  });
};
