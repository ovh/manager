export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive.add', {
    url: '/new',
    views: {
      'coldArchiveView@pci.projects.project.storages.cold-archive': {
        component: 'pciProjectsProjectStoragesColdArchiveAdd',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_cold_archive_add_breadcrumb',
        ),

      stepper: /* @ngInject */ () => ({
        nameArchiveStep: { name: 'cold_archive_name_archive', display: null },
        linkUserArchiveStep: {
          name: 'cold_archive_link_user_archive',
          display: null,
        },
      }),
    },
  });
};
