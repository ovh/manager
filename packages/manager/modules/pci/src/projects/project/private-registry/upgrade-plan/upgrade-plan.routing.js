import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.private-registry.upgrade-plan', {
    url: '/upgrade-plan?registryId',
    component: 'pciProjectsPrivateRegistryUpgradePlan',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_registry_upgrade_plan_breadcrumb'),

      cancelLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.private-registry', {
          projectId,
        }),

      registryId: /* @ngInject */ ($transition$) =>
        $transition$.params().registryId,

      plans: /* @ngInject */ (getAvailableUpgrades, registryId) =>
        getAvailableUpgrades({ id: registryId }).then((plans) =>
          map(plans, (plan) => ({
            ...plan,
            // Waiting for API to provide ...
            planCode: `registry.${plan.name
              .substring(0, 1)
              .toLowerCase()}-plan-equivalent.hour.monthly.postpaid`,
          })),
        ),
    },
  });
};
