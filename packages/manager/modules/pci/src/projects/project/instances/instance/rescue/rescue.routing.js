export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.rescue', {
      url: '/rescue/start',
      views: {
        modal: {
          component: 'pciInstancesInstanceRescue',
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
