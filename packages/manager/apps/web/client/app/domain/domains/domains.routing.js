import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.index', {
    url: `/configuration/domain?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/domain',
      dataModel: () => 'domain.Domain',
      defaultFilterColumn: () => 'domain',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('domains_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        domain,
        parentService,
      }) =>
        parentService
          ? $state.href('app.domain.alldom', {
              allDom: parentService.name,
              productId: domain,
            })
          : $state.href('app.domain.product', {
              productId: domain,
            }),
    },
  });
};
