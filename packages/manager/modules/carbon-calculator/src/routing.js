export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app', {
    url: '/carbon',
    template: `<div>
                  <div data-ui-view></div>
              </div>`,
    // redirectTo: (transition) =>
    // transition
    //   .injector()
    //   .getAsync('features')
    //   .then((featureAvailabilityResult) =>
    //     featureAvailabilityResult.isFeatureAvailable('carbon-calculator')
    //       ? 'app.dashboard'
    //       : 'app.onboarding',
    //   ),
    redirectTo: () => 'app.dashboard',
    resolve: {
      breadcrumb: () => 'carbon calculator', // TODO translation
      // apiPath: () => '/me/carbon-calculator',
      // dataModel: () => 'carbonCalculator.Task',
      // defaultFilterColumn: () => 'taskID',
      header: () => 'carbon calculator', // TODO translation
      // customizableColumns: () => true,
      // getServiceNameLink: /* @ngInject */ ($state) => ({ taskID }) => {
      //   $state.href('app.dashboard', {
      //     taskID,
      //   });
      // },
    },
  });
};
