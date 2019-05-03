export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.objects.onboarding', {
      url: '/onboarding',
      component: 'pciProjectStorageObjectsOnboarding',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addObjectStorage: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.objects.add', {
          projectId,
        }),
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
};
