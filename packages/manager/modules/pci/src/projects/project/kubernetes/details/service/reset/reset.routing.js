export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.service.reset',
    {
      url: '/reset',
      views: {
        '@pci.projects.project.kubernetes.details': {
          component: 'pciProjectKubernetesServiceReset',
        },
      },
      resolve: {
        goBack: /* @ngInject */ (goToKubernetesDetails) =>
          goToKubernetesDetails,
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_projects_project_kubernetes_service_reset'),
      },
    },
  );
};
