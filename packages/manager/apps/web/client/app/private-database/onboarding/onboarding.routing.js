export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.onboarding', {
    url: '/onboarding',
    component: 'privateDatabasesOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0
            ? { state: 'app.private-database.index' }
            : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      cloudDbAvailability: /* @ngInject */ (ovhFeatureFlipping) => {
        const cloudDbFeature = 'cloud-database';

        return ovhFeatureFlipping
          .checkFeatureAvailability(cloudDbFeature)
          .then((featureAvailability) => {
            return featureAvailability.isFeatureAvailable(cloudDbFeature);
          });
      },
      resources: /* @ngInject */ ($http) =>
        $http.get('/hosting/privateDatabase').then(({ data }) => data),
      ctaURL: /* @ngInject */ ($state) =>
        $state.href('app.private-database-order-clouddb'),
    },
  });
};
