export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.delete', {
      url: '/delete?instanceId',
      views: {
        modal: {
          component: 'pciInstancesInstanceDelete',
        },
      },
      layout: 'modal',
      resolve: {
        instanceId: /* @ngInject */($transition$) => $transition$.params().instanceId,
        instance: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          projectId,
          instanceId,
        ) => PciProjectsProjectInstanceService
          .get(projectId, instanceId),
        goBack: /* @ngInject */ (goToInstances) => goToInstances,
        breadcrumb: () => null,
      },
    });
};
