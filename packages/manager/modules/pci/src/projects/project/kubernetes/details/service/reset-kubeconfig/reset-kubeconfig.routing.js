export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.service.reset-kubeconfig',
    {
      url: '/reset-kubeconfig',
      views: {
        modal: {
          component: 'pciProjectKubernetesServiceResetKubeconfig',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToKubernetesDetails) =>
          goToKubernetesDetails,
        breadcrumb: () => null,
      },
    },
  );
};
