export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.onboarding', {
    url: '/onboarding',
    component: 'nutanixOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((services) =>
          services.length !== 0
            ? {
                state: 'nutanix.index',
              }
            : false,
        ),
    resolve: {
      breadcrumb: () => null,
    },
  });
};
