import { ENTITY } from '../../../iam.constants';
import { RESOURCE_GROUPS_TRACKING_HITS } from '../resourceGroups.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies.resourceGroups.delete', {
    url: '/delete/{resourceGroup:uuid}',
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
      entity: /* @ngInject */ (resourceGroup) => {
        if (resourceGroup) {
          return { data: resourceGroup, type: ENTITY.RESOURCE_GROUP };
        }
        return null;
      },

      /**
       * The resourceGroup parameter based on the resourceGroup's id
       * @returns {Object|null}
       */
      resourceGroup: /* @ngInject */ ($transition$, IAMService) => {
        const { resourceGroup: uuid } = $transition$.params();
        return uuid ? IAMService.getResourceGroup(uuid) : null;
      },

      /**
       * Whether the entity requires a statement
       * @returns {boolean}
       */
      statement: /* @ngInject */ (entity) =>
        entity.type === ENTITY.RESOURCE_GROUP,
    },
    atInternet: {
      rename: RESOURCE_GROUPS_TRACKING_HITS.DELETE_RESOURCE_GROUP_MODAL,
    },
  });
};
