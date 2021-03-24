export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.quota', {
    url: '/quota',
    component: 'pciProjectQuota',
    resolve: {
      region: /* @ngInject */ (coreConfig) => coreConfig.getRegion(),

      hasDefaultPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
        ovhPaymentMethod.hasDefaultPaymentMethod(),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_quota'),

      increaseQuotaLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.quota.increase', {
          projectId,
        }),
    },
  });
};
