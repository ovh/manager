export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster', {
    url: '/cluster/:clusterId',
    template: '<div ui-view></div>',
    // redirectTo: 'app.dedicated-cluster.cluster.dashboard',
    resolve: {
      clusterId: /* @ngInject */ ($transition$) =>
        $transition$.params().clusterId,
    },
  });
};
