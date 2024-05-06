import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import template from './template.html';
import { FEATURES } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp', {
    url: '/netapp',
    template,
    redirectTo: 'netapp.index',
    resolve: {
      features: /* @ngInject */ (ovhFeatureFlipping) => {
        const features = `${FEATURES.map(
          (feature) => `netapp:${feature}`,
        )},vrack-services`;
        return ovhFeatureFlipping.checkFeatureAvailability(features);
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_title'),
    },
  });

  $stateProvider.state('netapp.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      netappContainer: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      Promise.all([
        transition.injector().getAsync('resources'),
        transition.injector().getAsync('features'),
      ]).then(([services, features]) =>
        services.data.length === 0 &&
        features.isFeatureAvailable('netapp:order')
          ? {
              state: 'netapp.onboarding',
            }
          : false,
      ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/storage/netapp',
      columnConfig: /* @ngInject */ ($translate) => ({
        data: [
          {
            label: $translate.instant(`netapp_list_columns_header_id`),
            hidden: false,
            property: 'id',
            serviceLink: true,
          },
          {
            label: $translate.instant(`netapp_list_columns_header_name`),
            property: 'name',
          },
          {
            label: $translate.instant(`netapp_list_columns_header_status`),
            property: 'status',
            format: (value) => value.status,
            map: (row) => {
              switch (row.status) {
                case 'creating':
                case 'reopening':
                case 'running':
                  return 'success';
                case 'deleted':
                case 'deleting':
                  return 'warning';
                case 'suspended':
                case 'suspending':
                  return 'error';
                default:
                  return 'info';
              }
            },
          },
          {
            label: $translate.instant(`netapp_list_columns_header_region`),
            property: 'region',
          },
          {
            label: $translate.instant(`netapp_list_columns_header_quota`),
            property: 'quota',
          },
          {
            label: $translate.instant(`netapp_list_columns_header_product`),
            property: 'product',
          },
          {
            label: $translate.instant(
              `netapp_list_columns_header_performanceLevel`,
            ),
            property: 'performanceLevel',
            hidden: true,
          },
        ],
      }),
      dataModel: () => 'storage.NetAppService',
      defaultFilterColumn: () => 'id',
      header: () => 'Enterprise File Storage',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ id }) =>
        $state.href('netapp.dashboard', {
          serviceName: id,
        }),
      schema: /* @ngInject */ ($http) =>
        $http.get('/storage.json').then(({ data }) => data),

      /**
       * Used into ngLayoutHelper to define datagrid Topbar CTA
       */
      topbarOptions: /* @ngInject */ ($translate, goToOrder) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('netapp_order_cta_label'),
          value: $translate.instant('netapp_order_cta_value'),
          onClick: () => {
            goToOrder();
          },
        },
      }),

      goToOrder: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          type: 'action',
          name: `netapp::create`,
        });

        return $state.go('netapp.order');
      },

      hideBreadcrumb: () => true,
    },
  });
};
