export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.archives.onboarding', {
      url: '/onboarding',
      component: 'pciProjectStorageCloudArchivesOnboarding',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addCloudArchive: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.archives.add', {
          projectId,
        }),
      },
    });
};
