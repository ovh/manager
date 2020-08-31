import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iplb.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      iplbContainer: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/ipLoadbalancing',
      dataModel: () => 'ipLoadbalancing.Ip',
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) => $translate.instant('iplb_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('iplb.detail', {
          serviceName,
        }),
    },
  });
};
