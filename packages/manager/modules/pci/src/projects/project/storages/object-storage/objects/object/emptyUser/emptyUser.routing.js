export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.containers.objects.emptyUser',
    {
      url: '/emptyUser',
      views: {
        modal: {
          component: 'pciProjectStorageContainersContainerEmptyUser',
        },
      },
      layout: 'modal',
      resolve: {
        goToUsersAndRoles: /* @ngInject */ ($state) => () =>
          $state.go('pci.projects.project.users'),
        goBack: /* @ngInject */ (goToStorageContainers) =>
          goToStorageContainers,
        breadcrumb: () => null,
      },
    },
  );
};
