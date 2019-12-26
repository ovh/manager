export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.quota', {
    url: '/quota',
    component: 'pciProjectQuota',
    resolve: {
      quotas: /* @ngInject */ (OvhApiCloudProjectQuota, projectId) =>
        OvhApiCloudProjectQuota.v6().query({
          serviceName: projectId,
        }).$promise,

      region: /* @ngInject */ (coreConfig) => coreConfig.getRegion(),

      /* @ngInject */
      defaultPaymentMean: (PciProjectQuota, region) =>
        PciProjectQuota.getDefaultPaymentMean(region),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_quota'),
    },
  });
};
