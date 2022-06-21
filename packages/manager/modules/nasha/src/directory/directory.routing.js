import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import { NASHA_TITLE } from '../nasha.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.directory', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/dedicated/nasha',
      dataModel: () => 'dedicated.nasha.Storage',
      defaultFilterColumn: () => 'serviceName',
      header: () => NASHA_TITLE,
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('nasha.dashboard', { serviceName }),
      topbarOptions: /* @ngInject */ ($translate, $state) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('nasha_directory_order_label'),
          value: $translate.instant('nasha_directory_order_value'),
          onClick: () => $state.go('nasha.order'),
        },
      }),
      breadcrumb: () => null,
    },
  });
};
