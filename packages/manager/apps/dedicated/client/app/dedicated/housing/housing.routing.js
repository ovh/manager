import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicated-housing.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/dedicated/housing',
      dataModel: () => 'dedicated.housing.Housing',
      defaultFilterColumn: () => 'name',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_housing'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ name: productId }) =>
        $state.href('dedicated-housing.dashboard', {
          productId,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
