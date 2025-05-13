export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox-configure', {
    url: '/configure',
    component: 'overTheBoxConfigure',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('overTheBox_configure_breadcrumb'),
      orderHash: /* @ngInject */ ($state) => () =>
        $state.href('order-overTheBox'),
      goOrderOverTheBox: /* @ngInject */ ($state) => () =>
        $state.go('order-overTheBox'),
    },
  });

  // special redirection for /configure/overTheBox which is inside internal OTB UX
  $urlRouterProvider.when('/configure/overTheBox', '/overTheBox/configure');
};
