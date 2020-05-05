export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.monitoring', {
    url: '/monitoring',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerMonitoring',
      },
    },
    resolve: {
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicated.server.dashboard'),
    },
  });
};
