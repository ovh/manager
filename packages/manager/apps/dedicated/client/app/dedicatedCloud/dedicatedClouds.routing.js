import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getDedicatedCloudOrderUrl } from './dedicatedClouds-order';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.index', {
    url: `/?${ListLayoutHelper.urlQueryParams}`,
    component: 'ovhManagerPccList',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length === 0
            ? { state: 'app.dedicatedCloud.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      staticResources: () => true,
      apiPath: () => '/dedicatedCloud',
      dataModel: () => 'dedicatedCloud.dedicatedCloud',
      defaultFilterColumn: () => 'serviceName',
      resources: /* @ngInject */ ($http, apiPath) =>
        $http
          .get(apiPath, {
            headers: {
              'X-Pagination-Mode': 'CachedObjectList-Pages',
              'X-Pagination-Filter': 'productReference:eq=EPCC',
            },
          })
          .then(({ data }) => data),
      header: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_clouds_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: productId,
      }) =>
        $state.href('app.dedicatedCloud.details.dashboard', {
          productId,
        }),
      topbarOptions: /* @ngInject */ (
        $translate,
        $window,
        coreConfig,
        atInternet,
      ) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('dedicated_clouds_order'),
          value: $translate.instant('dedicated_clouds_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'dedicated::dedicatedCloud::index::order',
              type: 'action',
            });
            $window.open(
              getDedicatedCloudOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
  });
};
