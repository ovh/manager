export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.objects.objects.object.addUser',
    {
      url: '/addUser',
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
                    'pci.projects.project.storages.objects.objects.object.emptyUser',
                }
              : false,
          ),
      layout: 'modal',
      params: {
        objectKey: null,
      },
      resolve: {
        objectKey: /* @ngInject */ ($transition$) =>
          $transition$.params().objectKey,
        availableUsers: /* @ngInject */ ($http, projectId) =>
          $http
            .get(`/cloud/project/${projectId}/user`)
            .then(({ data }) => data),
        goToUsersAndRoles: /* @ngInject */ ($state) => () =>
          $state.go('pci.projects.project.users'),
        goBack: /* @ngInject */ (goToStorageContainer) => goToStorageContainer,
        breadcrumb: () => null,
      },
    },
  );
};
