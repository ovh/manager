export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.onboarding', {
    url: '/onboarding',
    component: 'ovhManagerNetAppOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((services) =>
          services.data.length !== 0
            ? {
                state: 'netapp.index',
              }
            : false,
        ),
    resolve: {
      discover: () => () => console.log('Hello'),
      resources: /* @ngInject */ ($http) => $http.get('/storage/netapp'),
      breadcrumb: () => null,
    },
  });
};
