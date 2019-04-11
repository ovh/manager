export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.objects.add', {
      url: '/new',
      component: 'pciProjectStorageContainersAdd',
      resolve: {
        goBack: /* @ngInject */ ($rootScope, $state, projectId) => (reload = false) => {
          if (reload) {
            $rootScope.$emit('pci_storages_containers_refresh');
          }
          return $state.go('pci.projects.project.storages.objects', {
            projectId,
          });
        },
        cancelLink: /* @ngInject */ ($state, projectId) => $state.href('pci.projects.project.storages.objects', {
          projectId,
        }),
      },
    });
};
