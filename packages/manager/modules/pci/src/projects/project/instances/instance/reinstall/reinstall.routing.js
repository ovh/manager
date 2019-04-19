export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.reinstall', {
      url: '/reinstall',
      views: {
        modal: {
          component: 'pciInstancesInstanceReinstall',
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
