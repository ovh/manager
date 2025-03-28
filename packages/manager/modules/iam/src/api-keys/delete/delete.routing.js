import { ENTITY } from '../../iam.constants';
import { API_KEYS_TRACKING_HITS } from '../api-keys.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.api-keys.delete', {
    url: '/delete/{apiKey:string}',
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
      entity: /* @ngInject */ (apiKey) =>
        apiKey ? { data: apiKey, type: ENTITY.API_KEY } : null,

      /**
       * The api key to delete if an id is provided
       * @returns {Object|null}
       */
      apiKey: /* @ngInject */ ($transition$, IAMService) => {
        const { apiKey: id } = $transition$.params();
        return id ? IAMService.getApiKey(id) : null;
      },

      /**
       * Whether the entity requires a statement
       * @returns {boolean}
       */
      statement: /* @ngInject */ (entity) => entity.type === ENTITY.API_KEY,
    },
    atInternet: {
      rename: API_KEYS_TRACKING_HITS.DELETE_MODAL,
    },
  });
};
