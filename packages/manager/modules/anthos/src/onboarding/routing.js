export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.onboarding', {
    url: '/onboarding',
    component: 'AnthosOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((services) =>
          services.length !== 0
            ? {
                state: 'anthos.index',
              }
            : false,
        ),
    resolve: {
      breadcrumb: () => null,
    },
  });
};
