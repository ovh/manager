import { ENTITY, TAG } from '../../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies.myPolicies.delete', {
    url: '/delete/{policy:uuid}',
    views: {
      modal: { component: 'iamDeleteEntity' },
    },
    layout: 'modal',
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
      policy: /* @ngInject */ ($transition$, IAMService) => {
        const { policy: uuid } = $transition$.params();
        return uuid ? IAMService.getPolicy(uuid) : null;
      },

      /**
       * Whether the entity requires a statement
       * @returns {boolean}
       */
      statement: /* @ngInject */ (entity) => entity.type === ENTITY.POLICY,
    },
    atInternet: {
      rename: TAG.DELETE_POLICY,
    },
  });
};
