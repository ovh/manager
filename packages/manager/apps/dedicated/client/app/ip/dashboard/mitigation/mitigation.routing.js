export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.mitigation', {
    url: '/mitigation',
    abstract: true,
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
    },
  });
};
