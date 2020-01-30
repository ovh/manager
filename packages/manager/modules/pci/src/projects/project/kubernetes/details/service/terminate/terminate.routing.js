export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.service.terminate',
    {
      url: '/terminate',
      views: {
        modal: {
          component: 'pciProjectKubernetesServiceTerminate',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToKubernetesDetails) =>
          goToKubernetesDetails,
        isLegacyCluster: /* @ngInject */ (kubeId, Kubernetes) =>
          Kubernetes.isLegacyCluster(kubeId),
        breadcrumb: () => null,
      },
    },
  );
};
