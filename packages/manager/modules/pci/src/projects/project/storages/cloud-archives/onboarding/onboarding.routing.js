export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.archives.onboarding', {
      url: '/onboarding',
      component: 'pciProjectStorageCloudArchivesOnboarding',
      redirectTo: (transition) => transition
        .injector()
        .getAsync('containers')
        .then((containers) => (containers.length > 0 ? { state: 'pci.projects.project.storages.archives' } : false)),
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addCloudArchive: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.archives.add', {
          projectId,
        }),
      },
    });
};
