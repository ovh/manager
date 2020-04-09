export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.block', {
    url: '/block',
    abstract: true,
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
    },
  });
};
