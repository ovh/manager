import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import { NASHA_TITLE } from '../nasha.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.directory', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: /* @ngInject */ (baseApiUrl) => baseApiUrl,
      dataModel: () => 'dedicated.nasha.Storage',
      defaultFilterColumn: () => 'serviceName',
      header: () => NASHA_TITLE,
      changelog: () => 'nasha',
      customizableColumns: () => true,
      columnConfig: /* @ngInject */ ($translate) => ({
        data: [
          {
            label: $translate.instant(
              'nasha_directory_columns_header_serviceName',
            ),
            property: 'serviceName',
            serviceLink: true,
            hidden: false,
          },
          {
            label: $translate.instant(
              'nasha_directory_columns_header_canCreatePartition',
            ),
            property: 'canCreatePartition',
            serviceLink: false,
            hidden: false,
            format: ({ canCreatePartition }) =>
              $translate.instant(
                `nasha_directory_columns_header_canCreatePartition_${canCreatePartition}`,
              ),
          },
          {
            label: $translate.instant(
              'nasha_directory_columns_header_customName',
            ),
            property: 'customName',
            serviceLink: false,
            hidden: false,
          },
          {
            label: $translate.instant(
              'nasha_directory_columns_header_datacenter',
            ),
            property: 'datacenter',
            serviceLink: false,
            hidden: false,
          },
          {
            label: $translate.instant(
              'nasha_directory_columns_header_diskType',
            ),
            property: 'diskType',
            serviceLink: false,
            hidden: false,
          },
          {
            label: $translate.instant(
              'nasha_directory_columns_header_monitored',
            ),
            property: 'monitored',
            serviceLink: false,
            hidden: true,
            format: ({ monitored }) =>
              $translate.instant(
                `nasha_directory_columns_header_monitored_${monitored}`,
              ),
          },
          {
            label: $translate.instant(
              'nasha_directory_columns_header_zpoolCapacity',
            ),
            property: 'zpoolCapacity',
            serviceLink: false,
            hidden: true,
          },
          {
            label: $translate.instant(
              'nasha_directory_columns_header_zpoolSize',
            ),
            property: 'zpoolSize',
            serviceLink: false,
            hidden: true,
          },
        ],
      }),
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('nasha.dashboard', { serviceName }),
      topbarOptions: /* @ngInject */ ($translate, $state, atInternet) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('nasha_directory_order_label'),
          value: $translate.instant('nasha_directory_order_value'),
          onClick: () => {
            atInternet.trackClick({
              name: 'nasha::directory::add',
              type: 'action',
            });
            return $state.go('nasha.order');
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
  });
};
