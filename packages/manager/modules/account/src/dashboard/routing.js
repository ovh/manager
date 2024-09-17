export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard', {
    url: '/account/',
    component: 'account',
    resolve: {
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
