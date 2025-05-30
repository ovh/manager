import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      cdaDetails: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/dedicated/ceph',
      dataModel: () => 'dedicated.ceph.clusterGet.response',
      defaultFilterColumn: () => 'serviceName',
      columnConfig: /* @ngInject */ ($translate) => ({
        data: [
          {
            label: $translate.instant(`cda_columns_header_serviceName`),
            property: 'serviceName',
            serviceLink: true,
            hidden: false,
          },
          {
            label: $translate.instant(`cda_columns_header_cephVersion`),
            property: 'cephVersion',
            hidden: false,
          },
          {
            label: $translate.instant(`cda_columns_header_createDate`),
            property: 'createDate',
            hidden: false,
          },
          {
            label: $translate.instant(`cda_columns_header_crushTunables`),
            property: 'crushTunables',
            hidden: false,
          },
          {
            label: $translate.instant(`cda_columns_header_label`),
            property: 'label',
            hidden: false,
          },
          {
            label: $translate.instant(`cda_columns_header_region`),
            property: 'region',
            hidden: true,
          },
          {
            label: $translate.instant(`cda_columns_header_size`),
            property: 'size',
            hidden: true,
            format: (value) => `${value.size} TB`,
          },
          {
            label: $translate.instant(`cda_columns_header_state`),
            property: 'state',
            hidden: true,
            format: ({ state }) =>
              $translate.instant(`cda_columns_header_state_${state}`),
          },
          {
            label: $translate.instant(`cda_columns_header_status`),
            property: 'status',
            hidden: true,
            format: ({ status }) =>
              $translate.instant(`cda_columns_header_status_${status}`),
          },
          {
            label: $translate.instant(`cda_columns_header_updateDate`),
            property: 'updateDate',
            hidden: true,
          },
        ],
      }),
      header: /* @ngInject */ ($translate) => $translate.instant('cda_title'),
      changelog: () => 'cloud_disk_array',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('cda.dashboard', {
          serviceName,
        }),
      topbarOptions: /* @ngInject */ ($translate, $window, atInternet) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('cda_order'),
          value: $translate.instant('cda_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'cda::index::order',
              type: 'action',
            });
            $window.open('https://www.ovh.com/fr/cloud-disk-array/', '_blank');
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 ? 'cda.onboarding' : false,
        ),
  });
};
