export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('veeam-enterprise.onboarding', {
    url: '/onboarding',
    component: 'veeamEnterpriseOnboardingComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length > 0 ? { state: 'veeam-enterprise.index' } : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
      resources: /* @ngInject */ ($http) =>
        $http.get('/veeam/veeamEnterprise').then(({ data }) => data),
    },
  });
};
