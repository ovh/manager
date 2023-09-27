export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.private-registry.onboarding', {
    url: '/onboarding',
    component: 'pciProjectPrivateRegistryOnboarding',
    params: {
      registryId: null,
    },
    resolve: {
      registryId: /* @ngInject */ ($stateParams) => $stateParams.registryId,
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
