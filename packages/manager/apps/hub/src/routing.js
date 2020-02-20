export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '/',
    component: 'hubDashboard',
    resolve: {
      data: /* @ngInject */ ($http) =>
        $http
          .get('/hub', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      services: /* @ngInject */ (data) => data.data.services.data.data,
    },
  });

  $urlRouterProvider.otherwise('/');
};
