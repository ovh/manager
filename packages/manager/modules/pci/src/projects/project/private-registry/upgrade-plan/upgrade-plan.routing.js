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
        getAvailableUpgrades({ id: registryId }),
    },
  });
};
