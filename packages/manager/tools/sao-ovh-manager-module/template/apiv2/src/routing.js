<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
import { ApiV2ListHelper } from '../../ng-apiv2-helper/src';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app', {
    url: '/<%= name %>',
    template: '<div data-ui-view></div>',
    redirectTo: 'app.index',
    resolve: {
      breadcrumb: () => '<%= name %>',
      apiPath: () => '<%= apiPath %>',
      createItemsPromise: /* @ngInject */ ($q, apiPath, Apiv2Service) => ({
        cursor,
      }) => {
        if (!apiPath) return $q.promise([]);
        return Apiv2Service.httpApiv2List(
          { url: `/engine/api/v2${apiPath}`, params: {} },
          { cursor },
        ).then(({ data, ...rest }) => ({
          ...rest,
          data,
        }));
      },
    },
  });

  $stateProvider.state('app.index', {
    url: `?cursors`,
    component: 'apiV2ListLayout',
    params: ApiV2ListHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('createItemsPromise')
        .then((getResources) => {
          return getResources({}).then(({ data }) => {
            return !Array.isArray(data) || data.length === 0
              ? {
                  state: 'app.onboarding',
                }
              : false;
          });
        }),
    resolve: {
      ...ApiV2ListHelper.stateResolves,
      pageSize: () => 25,
      header: () => '<%= name %>',
      description: () =>
        'Auto generated list page which list the main resource using the cursor style apiv2 listing',
      columns: () =>
        <% if (resourceIdProperty === linkProperty) { %> [
            {
              title: '<%= resourceIdProperty %>',
              property: '<%= resourceIdProperty %>'
            }
          ]
        <% } else { %> [
            {
              title: '<%= linkProperty %>',
              property: '<%= linkProperty %>'
            },
            {
              title: '<%= resourceIdProperty %>',
              property: '<%= resourceIdProperty %>'
            },
          ]
        <% } %>,
      customizableColumns: () => true,
      linkProperty: () => '<%= linkProperty %>',
      resourceIdProperty: () => '<%= resourceIdProperty %>',
      getResourceLink: /* @ngInject */ ($state) => (resourceId) => {
        return $state.href('app.dashboard', { resourceId });
      },
      hideBreadcrumb: () => true,
    },
  });
};
