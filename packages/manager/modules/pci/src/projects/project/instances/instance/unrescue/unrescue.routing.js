export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.unrescue', {
      url: '/rescue/end',
      views: {
        modal: {
          component: 'pciInstancesInstanceUnrescue',
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
