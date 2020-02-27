export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.dashboard', {
    url: '/',
    component: 'hubDashboard',
  });

  $urlRouterProvider.otherwise('/');
};
