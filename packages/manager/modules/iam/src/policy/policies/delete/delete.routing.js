import { ENTITY } from '../../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy.policies.delete', {
    url: `/delete/{policy:uuid}`,
    component: 'iamDeleteEntity',
    resolve: {
      breadcrumb: () => null,

      /**
       * A polymorphic DTO required by the deleteEntity component
       * @returns {{
       *   data: Object,
       *   type: string
       * }|null}
       */
      entity: /* @ngInject */ (policy) => {
        if (policy) {
          return { data: policy, type: ENTITY.POLICY };
        }
        return null;
      },

      /**
       * The Policy parameter based on the policy's id
       * @returns {Object|null}
       */
      policy: /* @ngInject */ ($transition$, PolicyService) => {
        const { policy: uuid } = $transition$.params();
        return uuid ? PolicyService.getPolicy(uuid) : null;
      },

      /**
       * Whether the entity requires a statement
       * @returns {boolean}
       */
      statement: /* @ngInject */ (entity) =>
        [ENTITY.POLICY].includes(entity.type),
    },
  });
};
