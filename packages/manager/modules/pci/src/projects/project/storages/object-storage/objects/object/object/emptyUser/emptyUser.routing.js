export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.object-storage.objects.object.emptyUser',
    {
      url: '/emptyUser',
      views: {
        modal: {
          component: 'pciProjectStorageContainersContainerEmptyUser',
        },
      },
      layout: 'modal',
      resolve: {
        goToUsers: /* @ngInject */ ($state) => () => {
          return $state.go(
            'pci.projects.project.storages.object-storage.users',
          );
        },

        goBack: /* @ngInject */ (goToStorageContainer) => goToStorageContainer,

        breadcrumb: () => null,
      },
    },
  );
};
