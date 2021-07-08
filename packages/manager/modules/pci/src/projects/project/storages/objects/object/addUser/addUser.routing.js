export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.objects.addUser', {
    url: '/addUser?containerId',
    views: {
      modal: {
        component: 'pciProjectStorageContainersContainerAddUser',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('availableUsers')
        .then((availableUsers) =>
          availableUsers.length === 0
            ? { state: 'pci.projects.project.storages.objects.emptyUser' }
            : false,
        ),
    layout: 'modal',
    resolve: {
      containerId: /* @ngInject */ ($transition$) =>
        $transition$.params().containerId,
      availableUsers: /* @ngInject */ ($http, projectId) =>
        $http.get(`/cloud/project/${projectId}/user`).then(({ data }) => data),
      container: /* @ngInject */ (
        PciProjectStorageContainersService,
        projectId,
        containerId,
      ) =>
        PciProjectStorageContainersService.getContainer(projectId, containerId),
      goToUsersAndRoles: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.project.users'),
      goBack: /* @ngInject */ (goToStorageContainers) => goToStorageContainers,
      breadcrumb: () => null,
    },
  });
};
