export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.resume', {
    url: '/resume?instanceId',
    views: {
      modal: {
        component: 'pciInstancesInstanceResume',
      },
    },
    layout: 'modal',
    resolve: {
      instanceId: /* @ngInject */ ($transition$) =>
        $transition$.params().instanceId,
      instance: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instanceId,
      ) => PciProjectsProjectInstanceService.get(projectId, instanceId),
      goBack: /* @ngInject */ (goToInstances) => goToInstances,
      breadcrumb: () => null,
    },
  });
};
