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
  $stateProvider.state('app.dedicatedCloud.index.terminate', {
    url: 'terminate/:productId',
    layout: 'modal',
    views: {
      modal: {
        component: 'dedicatedCloudTerminate',
      },
    },
    resolve: {
      goBack: /* @ngInject */ ($state, $stateParams, $timeout, setMessage) => (
        message,
        type = 'success',
      ) => {
        const promise = $state.go('app.dedicatedCloud.index', $stateParams);
        if (message) {
          promise.then(() => $timeout(() => setMessage(message, type)));
        }
      },

      setMessage: /* @ngInject */ (Alerter) => (
        message = false,
        type = 'success',
      ) => {
        Alerter.set(`alert-${type}`, message, null, 'dedicatedCloud');
      },

      serviceInfos: /* @ngInject */ ($http, $stateParams) =>
        $http
          .get(`/dedicatedCloud/${$stateParams.productId}/serviceInfos`)
          .then(({ data }) => data),
      canDeleteAtExpiration: /* @ngInject */ (
        currentUser,
        ovhFeatureFlipping,
      ) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('dedicated-cloud:deleteAtExpiration')
          .then(
            (featureAvailability) =>
              featureAvailability.isFeatureAvailable(
                'dedicated-cloud:deleteAtExpiration',
              ) && !currentUser.isEnterprise,
          ),
      serviceName: /* @ngInject */ (productId) => productId,
      productId: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      breadcrumb: () => null,
    },
  });
};
