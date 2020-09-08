export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.dashboard', {
    url: '/dashboard',
    component: 'pciProjectTrainingDashboardComponent',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      usage: /* @ngInject */ (OvhApiCloudProjectUsageCurrent, projectId) =>
        OvhApiCloudProjectUsageCurrent.v6()
          .get({ serviceName: projectId })
          .$promise.catch(() => {
            return {
              resourcesUsage: [],
            };
          }),
      currencySymbol: /* @ngInject */ (OvhApiMe) =>
        OvhApiMe.v6()
          .get()
          .$promise.then((me) => {
            return me.currency.symbol;
          }),
      registry: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.getRegistry(projectId),
      goToJobs: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.jobs', {
          projectId,
        }),
      deleteRegistry: /* @ngInject */ (
        PciProjectTrainingService,
        projectId,
      ) => () => PciProjectTrainingService.deleteRegistry(projectId),
      saveRegistry: /* @ngInject */ (PciProjectTrainingService, projectId) => (
        url,
        username,
        password,
      ) =>
        PciProjectTrainingService.saveRegistry(
          projectId,
          url,
          username,
          password,
        ),
    },
  });
};
