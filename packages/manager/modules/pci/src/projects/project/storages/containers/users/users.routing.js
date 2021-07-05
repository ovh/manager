export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.objects.user-list', {
    url: '/users',
    views: {
      containersView: 'pciProjectStorageContainersUserList',
    },
    resolve: {
      userList: /* @ngInject */ (
        PciProjectStorageContainersService,
        projectId,
      ) => PciProjectStorageContainersService.getS3Users(projectId),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_userlist_username_title',
        ),
    },
  });
};
