export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive.objects', {
    url: '',
    views: {
      containersView: 'pciProjectStorageContainers',
    },
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
      archive: () => false,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_object_title',
        ),
    },
  });
};
