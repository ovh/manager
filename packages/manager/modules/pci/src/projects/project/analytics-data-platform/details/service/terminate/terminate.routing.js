export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.analytics-data-platform.details.service.terminate', {
      url: '/terminate',
      views: {
        modal: {
          component: 'adpServiceTerminate',
        },
      },
      layout: 'modal',
      resolve: {
        serviceName: /* @ngInject */ $stateParams => $stateParams.serviceName,
        goBack: /* @ngInject */ goToDetailsPage => goToDetailsPage,
        goToPublicCloud: /* @ngInject */ goToPublicCloudPage => goToPublicCloudPage,
      },
    });
};
