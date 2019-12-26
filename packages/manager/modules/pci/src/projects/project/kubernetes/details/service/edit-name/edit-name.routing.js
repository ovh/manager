export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details.service.name', {
    url: '/name',
    views: {
      modal: {
        component: 'pciProjectKubernetesServiceName',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToKubernetesDetails) => goToKubernetesDetails,
      breadcrumb: () => null,
    },
  });
};
