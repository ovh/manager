export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('platform-sh.onboarding', {
    url: '/onboarding',
    component: 'platformShOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('projects')
        .then((projects) =>
          projects.length > 0
            ? { state: 'platform-sh' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
