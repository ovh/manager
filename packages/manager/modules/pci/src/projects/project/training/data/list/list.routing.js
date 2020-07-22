export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.data.list', {
    url: '/list',
    views: {
      dataView: 'pciProjectTrainingDataListComponent',
    },
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      containerLink: /* @ngInject */ ($state, projectId) => (containerId) => {
        return $state.href('pci.projects.project.storages.objects.object', {
          projectId,
          containerId,
        });
      },
    },
  });
};
