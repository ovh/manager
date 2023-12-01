export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.intervention', {
    url: '/intervention',
    views: {
      'tabView@app.dedicated-cluster.cluster.node': {
        component: 'dedicatedClusterNodeInterventions',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_intervention'),
    },
  });
};
