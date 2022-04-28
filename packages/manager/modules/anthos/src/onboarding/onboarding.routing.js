export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.onboarding', {
    url: '/onboarding',
    component: 'anthosOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'anthos.index' } : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ (AnthosTenantsService) =>
        AnthosTenantsService.getTenants(),
    },
  });
};
