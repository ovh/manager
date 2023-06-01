export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.identities', {
    url: '/identities/{policy:uuid}',
    component: 'iamIdentities',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate, policy) =>
        $translate.instant('iam_identities_title', { policy: policy.name }),

      /**
       * The Policy parameter based on the policy's id
       * @returns {Object|null}
       */
      policy: /* @ngInject */ ($transition$, IAMService) => {
        const { policy: uuid } = $transition$.params();
        return uuid ? IAMService.getPolicy(uuid) : null;
      },
    },
  });
};
