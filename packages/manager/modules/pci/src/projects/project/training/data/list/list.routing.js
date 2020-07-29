export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.data.list', {
    url: '/',
    component: 'pciProjectTrainingDataListComponent',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      goToContainer: /* @ngInject */ ($state, projectId) => (containerId) =>
        $state.go('pci.projects.project.storages.objects.object', {
          projectId,
          containerId,
        }),
    },
  });
};
