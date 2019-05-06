export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.failover-ips', {
      url: '/failover-ips',
      component: 'pciProjectFailoverIps',
      translations: {
        format: 'json',
        value: ['.'],
      },
      redirectTo: transition => transition
        .injector()
        .getAsync('failoverIps')
        .then(failoverIps => (failoverIps.length === 0 ? { state: 'pci.projects.project.failover-ips.onboarding' } : false)),
      resolve: {
        breadcrumb: /* @ngInject */ $translate => $translate
          .refresh()
          .then(() => $translate.instant('pci_projects_project_failoverip_title')),
        failoverIps: /* @ngInject */ (
          OvhApiCloudProjectIpFailover,
          projectId,
        ) => OvhApiCloudProjectIpFailover
          .v6()
          .query({
            serviceName: projectId,
          })
          .$promise,
      },
    });
};
