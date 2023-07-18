import { TAG } from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy.edit', {
    url: '/edit/{policy:uuid}',
    component: 'iamCreatePolicy',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate, policy) =>
        $translate.instant('iam_policy_edit', { policy: policy.name }),

      /**
       * The Policy parameter based on the policy's id
       * @returns {Object|null}
       */
      policy: /* @ngInject */ ($transition$, IAMService) => {
        const { policy: uuid } = $transition$.params();
        return uuid ? IAMService.getDetailedPolicy(uuid) : null;
      },
    },
    atInternet: {
      rename: TAG.EDIT_POLICY,
    },
  });
};
