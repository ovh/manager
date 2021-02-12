<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '<%= apiPath %>',
      dataModel: () => '<%= apiModel %>',
      defaultFilterColumn: () => '<%= serviceName %>',
      header: () => '<%= name %>',
      customizableColumns: () => true,
      hideBreadcrumb: () => true,
    },
  });
};
