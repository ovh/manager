export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.objects.onboarding', {
    url: '/onboarding',
    component: 'pciProjectStorageObjectsOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length > 0
            ? { state: 'pci.projects.project.storages.objects.objects' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      addObjectStorage: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.objects.objects.add', {
          projectId,
        }),
    },
  });
};
