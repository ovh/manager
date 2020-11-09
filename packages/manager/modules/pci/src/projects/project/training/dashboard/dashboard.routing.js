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
      installLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.dashboard.install', {
          projectId,
        }),
      goToRegistyDetails: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.dashboard.registry', {
          projectId,
        }),
      currencySymbol: /* @ngInject */ (OvhApiMe) =>
        OvhApiMe.v6()
          .get()
          .$promise.then((me) => {
            return me.currency.symbol;
          }),
      goToJobs: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.jobs', {
          projectId,
        }),
    },
  });
};
