import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getManagedBareMetalOrderUrl } from './managed-baremetal-order';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.index', {
    url: `/managedBaremetal?${ListLayoutHelper.urlQueryParams}`,
    component: 'ovhManagerPccList',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length === 0 ? 'app.managedBaremetal.onboarding' : false,
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
              'X-Pagination-Filter': 'productReference:eq=MBM',
            },
          })
          .then(({ data }) => data),
      header: /* @ngInject */ ($translate) =>
        $translate.instant('managed_baremetal_title'),
      changelog: () => 'managed_baremetal',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: productId,
      }) =>
        $state.href('app.managedBaremetal.details.dashboard', {
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
          label: $translate.instant('managed_baremetal_order'),
          value: $translate.instant('managed_baremetal_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'dedicated::managedBaremetal::index::order',
              type: 'action',
            });
            $window.open(
              getManagedBareMetalOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
  });
};
