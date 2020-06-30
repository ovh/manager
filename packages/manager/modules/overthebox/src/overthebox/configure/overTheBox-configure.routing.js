export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('overTheBox-configure', {
    url: '/overTheBox/configure',
    component: 'overTheBoxConfigure',
  });

  // special redirection for /configure/overTheBox which is inside internal OTB UX
  $urlRouterProvider.when('/configure/overTheBox', '/overTheBox/configure');
};
