<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app', {
    url: '/<%= name %>',
    template: '<div data-ui-view></div>',
    redirectTo: 'app.index',
    resolve: {
      breadcrumb: () => '<%= name %>',
    },
  });

  $stateProvider.state('app.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((services) =>
          services.length === 0
            ? {
                state: 'app.onboarding',
              }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '<%= apiPath %>',
      dataModel: () => '<%= apiModel %>',
      defaultFilterColumn: () => '<%= serviceName %>',
      header: () => '<%= name %>',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        <%= serviceName %>,
      }) =>
        $state.href('app.dashboard', {
          serviceName: <%= serviceName %>,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
