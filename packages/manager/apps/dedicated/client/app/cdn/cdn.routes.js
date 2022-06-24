import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.networks.cdn.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/cdn/dedicated',
      dataModel: () => 'cdnanycast.Anycast',
      defaultFilterColumn: () => 'service',
      header: () => 'CDN',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        service: productId,
      }) =>
        $state.href('app.networks.cdn.dedicated', {
          productId,
        }),
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0
            ? { state: 'app.networks.cdn.onboarding' }
            : false,
        ),
  });
};
