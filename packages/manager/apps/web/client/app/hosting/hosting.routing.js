import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0
            ? { state: 'app.hosting.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/hosting/web',
      dataModel: () => 'hosting.web.Service',
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('hostings_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: productId,
      }) =>
        $state.href('app.hosting.dashboard', {
          productId,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
