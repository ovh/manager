export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack-services.onboarding', {
    url: '/onboarding',
    component: 'vrackServicesOnboarding',
    // TODO: Do this when API is working
    // redirectTo: (transition) =>
    //   transition
    //     .injector()
    //     .getAsync('resources')
    //     .then((services) =>
    //       services.length !== 0
    //         ? {
    //             state: 'app.index',
    //           }
    //         : false,
    //     ),
    resolve: {
      hideBreadcrumb: () => true,
      breadcrumb: () => null,
    },
  });
};
