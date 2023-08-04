export default /* @ngInject */ ($stateProvider) => {
  const featureName = 'carbon-calculator';

  $stateProvider.state('app', {
    url: '',
    template: `<div data-ui-view></div>`,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('features')
        .then((featureAvailability) =>
          featureAvailability.isFeatureAvailable(featureName)
            ? 'app.dashboard'
            : 'error',
        ),
    resolve: {
      breadcrumb: () => null,
      features: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability(featureName),
    },
  });
};
