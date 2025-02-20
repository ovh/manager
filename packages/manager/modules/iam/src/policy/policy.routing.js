export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy', {
    url: '/policy',
    component: 'iamPolicies',
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
  });
};
