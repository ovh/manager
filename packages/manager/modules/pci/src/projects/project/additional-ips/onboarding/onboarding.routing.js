export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips.onboarding', {
    url: '/onboarding',
    component: 'pciProjectAdditionalIpsOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('additionalIps')
        .then((additionalIps) =>
          additionalIps.failoverIps.length || additionalIps.floatingIps.length
            ? { state: 'pci.projects.project.additional-ips' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      goToAdditionalIpsOnboarding: /* @ngInject */ (
        $state,
        CucCloudMessage,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.additional-ips.onboarding',
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
              'pci.projects.project.additional-ips.onboarding',
            ),
          );
        }

        return promise;
      },
    },
  });
};
