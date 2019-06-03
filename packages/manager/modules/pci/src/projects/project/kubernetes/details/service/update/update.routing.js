export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes.details.service.update', {
      url: '/update',
      views: {
        modal: {
          component: 'pciProjectKubernetesServiceUpdate',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ goToKubernetesDetails => goToKubernetesDetails,
        breadcrumb: () => null,
      },
    });
};
