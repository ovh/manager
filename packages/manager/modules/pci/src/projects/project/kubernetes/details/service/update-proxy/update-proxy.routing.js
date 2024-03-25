export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.service.updateProxy',
    {
      url: '/updateProxy',
      views: {
        modal: {
          component: 'pciProjectKubernetesServiceUpdateProxy',
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
