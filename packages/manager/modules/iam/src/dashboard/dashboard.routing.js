export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.dashboard', {
    url: '/dashboard',
    component: 'iamDashboard',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('iamPolicies')
        .then((data) =>
          !data?.error ? { state: 'iam.dashboard.policies' } : false,
        )
        .catch(() => null),
    resolve: {
      iamPolicies: /* @ngInject */ (IAMService) =>
        IAMService.getPolicies({})
          .then((policies) => policies)
          .catch((error) => {
            if (error.status === 403) {
              return {
                error: error.data?.details?.unauthorizedActionsByIAM,
              };
            }

            throw error;
          }),
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
