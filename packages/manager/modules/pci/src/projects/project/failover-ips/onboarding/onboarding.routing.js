export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.failover-ips.onboarding', {
      url: '/onboarding',
      component: 'pciProjectFailoverIpsOnboarding',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addFailoverIp: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.failover-ips.imports', {
          projectId,
        }),
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
};
