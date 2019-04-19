export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.delete', {
      url: '/delete',
      views: {
        modal: {
          component: 'pciInstancesInstanceDelete',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state, projectId, instanceId) => () => $state.go('pci.projects.project.instances.instance', {
          projectId,
          instanceId,
        }),
      },
    });
};
