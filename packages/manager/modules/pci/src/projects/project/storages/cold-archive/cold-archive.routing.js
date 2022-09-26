export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive', {
    url: '/cold-archive',
    component: 'ovhManagerPciProjectStorageColdArchive',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length === 0
            ? {
                state: 'pci.projects.project.storages.cold-archive.onboarding',
              }
            : false,
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) => {
        return $translate.instant(
          'pci_projects_project_storages_cold_archive_title',
        );
      },
      containers: /* @ngInject */ (PciStoragesColdArchiveService, projectId) =>
        PciStoragesColdArchiveService.getAllColdArchives(projectId),
    },
  });
};
