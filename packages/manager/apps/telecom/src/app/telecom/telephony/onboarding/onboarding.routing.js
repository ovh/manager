export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.onboarding', {
    url: '/onboarding',
    views: {
      'telephonyView@telecom.telephony': {
        component: 'telephonyOnboardingComponent',
      },
    },
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/telephony').then(({ data }) => data),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'telecom.telephony.index' } : false,
        ),
  });
};
