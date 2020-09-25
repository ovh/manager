import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.manage.domain.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      apiPath: /* @ngInject */ (serviceName) =>
        `/cdn/dedicated/${serviceName}/domains`,
      schema: /* @ngInject */ ($http) =>
        $http.get('/cdn/dedicated.json').then(({ data }) => data),
      dataModel: () => 'cdnanycast.Domain',
      defaultFilterColumn: () => 'domain',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ domain }) =>
        $state.href('app.networks.cdn.dedicated.manage.domain.dashboard', {
          domain,
        }),
      breadcrumb: () => null,
    },
  });
};
