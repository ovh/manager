export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.hard-reboot', {
      url: '/hard-reboot',
      views: {
        modal: {
          component: 'pciInstancesInstanceReboot',
        },
      },
      layout: 'modal',
      resolve: {
        rebootType: () => 'hard',
        goBack: /* @ngInject */ ($state, projectId, instanceId) => () => $state.go('pci.projects.project.instances.instance', {
          projectId,
          instanceId,
        }),
      },
    });
};
