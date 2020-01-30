export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.failover-ips.onboarding', {
    url: '/onboarding',
    component: 'pciProjectFailoverIpsOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('failoverIps')
        .then((failoverIps) =>
          failoverIps.length > 0
            ? { state: 'pci.projects.project.failover-ips' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      addFailoverIp: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.failover-ips.imports', {
          projectId,
        }),
      buyFailoverIp: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.failover-ips.onboarding.order', {
          projectId,
        }),
      goToFailoverIpsOnboarding: /* @ngInject */ (
        $state,
        CucCloudMessage,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.failover-ips.onboarding',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.failover-ips.onboarding',
            ),
          );
        }

        return promise;
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
