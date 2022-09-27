export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive', {
    url: '/cold-archive',
    component: 'ovhManagerPciProjectsProjectStoragesColdArchive',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_cold_archive_breadcrumb',
        ),

      userList: /* @ngInject */ (projectId, allUserList) =>
        allUserList.filter((user) => user?.s3Credentials?.length > 0),

      allUserList: /* @ngInject */ (
        projectId,
        PciStoragesObjectStorageService,
      ) =>
        PciStoragesObjectStorageService.getAllS3Users(projectId).then((users) =>
          PciStoragesObjectStorageService.mapUsersToCredentials(
            projectId,
            users,
          ),
        ),

      goToArchives: ($state, projectId, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.storages.cold-archive';

        const promise = $state.go(
          state,
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => CucCloudMessage[type](message, state));
        }

        return promise;
      },
    },
  });
};
