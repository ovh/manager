import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0
            ? { state: 'app.dedicatedCloud.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/dedicatedCloud',
      dataModel: () => 'dedicatedCloud.dedicatedCloud',
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_clouds_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: productId,
      }) =>
        $state.href('app.dedicatedCloud.details.dashboard', {
          productId,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
