export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '/',
  });

  $urlRouterProvider.otherwise('/');
};
