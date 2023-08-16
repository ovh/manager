export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack-services.onboarding', {
    url: '/onboarding',
    component: 'vrackServicesOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('createItemsPromise')
        .then((getResources) => {
          return getResources({}).then(({ data }) => {
            return Array.isArray(data) && data.length > 0
              ? {
                  state: 'vrack-services.index',
                }
              : false;
          });
        }),
    resolve: {
      hideBreadcrumb: () => true,
      breadcrumb: () => null,
    },
  });
};
