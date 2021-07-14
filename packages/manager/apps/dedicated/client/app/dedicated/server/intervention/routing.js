export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.intervention', {
    url: '/intervention',
    views: {
      'tabView@app.dedicated-server.server': {
        component: 'dedicatedServerInterventions',
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
