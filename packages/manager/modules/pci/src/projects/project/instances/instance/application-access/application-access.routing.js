export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.application-access', {
      url: '/application/access',
      views: {
        modal: {
          component: 'pciInstancesInstanceApplicationAccess',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToInstance) => goToInstance,
        applicationAccesses: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          projectId,
          instance,
        ) => PciProjectsProjectInstanceService.getApplicationAccess(projectId, instance),
        breadcrumb: () => null,
      },
    });
};
