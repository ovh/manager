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
      breadcrumb: () => null,
    },
  });
};
