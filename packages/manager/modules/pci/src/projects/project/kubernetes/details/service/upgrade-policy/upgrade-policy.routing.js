export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.service.upgradePolicy',
    {
      url: '/upgrade-policy',
      views: {
        modal: {
          component: 'pciProjectKubernetesServiceUpgradePolicy',
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
