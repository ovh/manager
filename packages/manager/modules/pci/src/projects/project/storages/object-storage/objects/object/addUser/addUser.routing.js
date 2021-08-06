import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.objects.addUser',
    {
      url: '/addUser/?containerId',
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
              ? {
                  state:
                    'pci.projects.project.storages.object-storage.objects.emptyUser',
                }
              : false,
          ),
      layout: 'modal',
      resolve: {
        containerId: /* @ngInject */ ($transition$) =>
          $transition$.params().containerId,
        availableUsers: /* @ngInject */ ($http, projectId) =>
          $http
            .get(`/cloud/project/${projectId}/user`)
            .then(({ data }) => data),
        container: /* @ngInject */ (
          PciProjectStorageContainersService,
          projectId,
          containerId,
          containers,
        ) => {
          const container = find(containers, { id: containerId });
          return PciProjectStorageContainersService.getContainer(
            projectId,
            containerId,
            container.isHighPerfStorage,
          );
        },
        goToUsersAndRoles: /* @ngInject */ ($state) => () =>
          $state.go('pci.projects.project.users'),
        goBack: /* @ngInject */ (goToStorageContainers) =>
          goToStorageContainers,
        breadcrumb: () => null,
      },
    },
  );
};
