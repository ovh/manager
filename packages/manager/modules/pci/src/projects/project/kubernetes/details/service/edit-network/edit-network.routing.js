export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.service.edit-network',
    {
      url: '/edit-network',
      views: {
        modal: {
          component: 'pciKubernetesEditNetwork',
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
