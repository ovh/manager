export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.service.cancel', {
    url: '/cancel',
    views: {
      modal: {
        component: 'webPaasProjectTerminate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToProjectDetails) => goToProjectDetails,
      breadcrumb: () => null,
    },
  });
};
