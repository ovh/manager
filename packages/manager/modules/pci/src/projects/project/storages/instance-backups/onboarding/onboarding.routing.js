export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.instance-backups.onboarding', {
      url: '/onboarding',
      component: 'pciProjectStorageInstanceBackupsOnboarding',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addInstanceBackup: /* @ngInject */($state, projectId) => () => $state.go('pci.projects.project.instances', {
          projectId,
          help: 'backup',
        }),
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
};
