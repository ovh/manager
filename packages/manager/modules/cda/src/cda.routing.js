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
      columnConfig: /* @ngInject */ () => ({
        data: [
          {
            label: 'Service Name',
            property: 'serviceName',
            serviceLink: true,
            hidden: false,
          },
          { label: 'Ceph Version', property: 'cephVersion', hidden: false },
          { label: 'Create Date', property: 'createDate', hidden: false },
          { label: 'Crush Tunables', property: 'crushTunables', hidden: false },
          { label: 'Label', property: 'label', hidden: false },
          { label: 'Region', property: 'region', hidden: true },
          {
            label: 'Size',
            property: 'size',
            hidden: true,
            format: (value) => `${value.size} TB`,
          },
          { label: 'State', property: 'state', hidden: true },
          { label: 'Status', property: 'status', hidden: true },
          { label: 'Update Date', property: 'updateDate', hidden: true },
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
