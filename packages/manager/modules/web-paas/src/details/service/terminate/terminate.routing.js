export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.details.service.cancel', {
    url: '/cancel',
    views: {
      modal: {
        component: 'webPaasDetailsServiceTerminate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToProjectDetails) => goToProjectDetails,
      breadcrumb: () => null,
    },
  });
};
