import { Environment } from '@ovh-ux/manager-config';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.dashboard', {
    url: '/dashboard',
    component: 'pciProjectTrainingDashboardComponent',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      usage: /* @ngInject */ (OvhApiCloudProjectUsageCurrent, projectId) =>
        OvhApiCloudProjectUsageCurrent.v6()
          .get({ serviceName: projectId })
          .$promise.catch(() => ({
            resourcesUsage: [],
          })),
      goToInstallDetails: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.dashboard.install', {
          projectId,
        }),
      goToRegistryDetails: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.dashboard.registry', {
          projectId,
        }),
      currencySymbol: () => Environment.getUser().currency.symbol,
      goToJobs: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.jobs', {
          projectId,
        }),
    },
  });
};
