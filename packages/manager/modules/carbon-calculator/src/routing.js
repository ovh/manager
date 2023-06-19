export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app', {
    url: '/billing',
    template: `<div data-ui-view></div>`,
    redirectTo: (transition) =>
      transition
        .injector()
        .get('ovhFeatureFlipping') // getAsync('features') throws error;
        .checkFeatureAvailability('carbon-calculator')
        .then((featureAvailability) =>
          featureAvailability.isFeatureAvailable('carbon-calculator')
            ? 'app.dashboard'
            : 'error',
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('carbon_calculator_my_account'),
    },
  });
};
