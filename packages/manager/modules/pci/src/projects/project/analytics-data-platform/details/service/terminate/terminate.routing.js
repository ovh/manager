export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.analytics-data-platform.details.service.terminate',
    {
      url: '/terminate',
      views: {
        modal: {
          component: 'analyticsDataPlatformDetailsServiceTerminate',
        },
      },
      layout: 'modal',
      resolve: {
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        goBack: /* @ngInject */ (goToDetailsPage) => goToDetailsPage,
        goToPublicCloud: /* @ngInject */ (goToPublicCloudPage) =>
          goToPublicCloudPage,
      },
    },
  );
};
