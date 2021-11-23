export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.apps.onboarding', {
    url: '/onboarding',
    component: 'pciProjectAppsOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('apps')
        .then((apps) =>
          apps.length > 0 ? { state: 'pci.projects.project.apps' } : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
