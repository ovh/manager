export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('overTheBox-configure', {
    url: '/overTheBox/configure',
    component: 'overTheBoxConfigure',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      orderHash: /* @ngInject */ ($state) => () =>
        $state.href('order-overTheBox'),
      goOrderOverTheBox: /* @ngInject */ ($state) => () =>
        $state.go('order-overTheBox'),
    },
  });

  // special redirection for /configure/overTheBox which is inside internal OTB UX
  $urlRouterProvider.when('/configure/overTheBox', '/overTheBox/configure');
};
