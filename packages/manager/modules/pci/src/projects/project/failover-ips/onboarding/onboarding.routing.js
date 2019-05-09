export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.failover-ips.onboarding', {
      url: '/onboarding',
      component: 'pciProjectFailoverIpsOnboarding',
      redirectTo: transition => transition
        .injector()
        .getAsync('failoverIps')
        .then(failoverIps => (failoverIps.length > 0 ? { state: 'pci.projects.project.failover-ips' } : false)),
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
