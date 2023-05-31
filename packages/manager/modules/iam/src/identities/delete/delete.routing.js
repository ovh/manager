import { ENTITY } from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.identities.delete', {
    url: `/delete/{identity:urn}`,
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
      entity: /* @ngInject */ (policy, identity) => {
        if (identity && policy) {
          return {
            data: { policy, identity, name: identity.componentsString },
            type: ENTITY.IDENTITY,
          };
        }
        return null;
      },

      /**
       * The Identity parameter based on the identity's urn
       * @returns {Object|null}
       */
      identity: /* @ngInject */ ($transition$) => {
        const { identity } = $transition$.params();
        return identity || null;
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
