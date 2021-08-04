export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.objects.objects.object.emptyUser',
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
        goBack: /* @ngInject */ (goToStorageContainer) => goToStorageContainer,
        breadcrumb: () => null,
      },
    },
  );
};
