export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.tags.assign', {
    url: '/assign',
    views: {
      modal: {
        component: 'serverAssignTags',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
