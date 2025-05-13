export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.onboarding', {
    url: '/onboarding',
    component: 'cloudConnectOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/ovhCloudConnect').then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'cloud-connect.index' } : false,
        ),
  });
};
