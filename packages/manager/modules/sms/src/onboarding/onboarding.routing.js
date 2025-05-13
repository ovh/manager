export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.onboarding', {
    url: '/onboarding',
    component: 'smsOnboardingComponent',
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/sms').then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'sms.index' } : false,
        ),
  });
};
