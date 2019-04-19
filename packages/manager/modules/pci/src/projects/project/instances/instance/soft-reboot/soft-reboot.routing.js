export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.soft-reboot', {
      url: '/soft-reboot',
      views: {
        modal: {
          component: 'pciInstancesInstanceReboot',
        },
      },
      layout: 'modal',
      resolve: {
        rebootType: () => 'soft',
        goBack: /* @ngInject */ ($state, projectId, instanceId) => () => $state.go('pci.projects.project.instances.instance', {
          projectId,
          instanceId,
        }),
      },
    });
};
