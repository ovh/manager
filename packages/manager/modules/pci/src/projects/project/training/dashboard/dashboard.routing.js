import flatten from 'lodash/flatten';
import map from 'lodash/map';
import filter from 'lodash/filter';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.dashboard', {
    url: '/dashboard',
    component: 'pciProjectTrainingDashboardComponent',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      resourceUsage: /* @ngInject */ (
        $http,
        coreConfig,
        isLegacyProject,
        OvhApiCloudProjectUsageCurrent,
        projectId,
        service,
      ) =>
        isLegacyProject
          ? OvhApiCloudProjectUsageCurrent.v6()
              .get({ serviceName: projectId })
              .$promise.catch(() => {
                return {
                  resourcesUsage: [],
                };
              })
              .then((usage) =>
                flatten(
                  map(
                    filter(usage.resourcesUsage, {
                      type: 'ai-training',
                    }),
                    'totalPrice',
                  ),
                ).reduce((a, b) => a + b, 0),
              )
              .then((usage) => {
                const locale = coreConfig.getUserLocale().replace('_', '-');
                const currency = coreConfig.getUser().currency.code;
                return new Intl.NumberFormat(locale, {
                  style: 'currency',
                  currency,
                }).format(usage);
              })
          : $http
              .get(`/services/${service.serviceId}/consumption`)
              .then(({ data }) => data)
              .then(
                (consumption) =>
                  consumption.priceByPlanFamily.find(
                    ({ planFamily }) => planFamily === 'ai-training',
                  )?.price?.text,
              ),
      goToInstallDetails: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.dashboard.install', {
          projectId,
        }),
      goToRegistryDetails: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.dashboard.registry', {
          projectId,
        }),
      goToJobs: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.jobs', {
          projectId,
        }),
    },
  });
};
