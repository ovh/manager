import { ENTITY, TAG } from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.dashboard.applications.delete', {
    url: '/delete/{application:string}',
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
      entity: /* @ngInject */ (application) => {
        if (application) {
          return { data: application, type: ENTITY.APPLICATION };
        }
        return null;
      },

      /**
       * The application to delete if an id is provided
       * @returns {Object|null}
       */
      application: /* @ngInject */ ($transition$, IAMService) => {
        const { application: id } = $transition$.params();
        return id ? IAMService.getApplication(id) : null;
      },

      /**
       * Whether the entity requires a statement
       * @returns {boolean}
       */
      statement: /* @ngInject */ (entity) => entity.type === ENTITY.APPLICATION,
    },
    atInternet: {
      rename: TAG.DELETE_APPLICATION,
    },
  });
};
