export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes.details.service.reset', {
      url: '/reset',
      views: {
        modal: {
          component: 'pciProjectKubernetesServiceReset',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToKubernetesDetails) => goToKubernetesDetails,
        breadcrumb: () => null,
      },
    });
};
