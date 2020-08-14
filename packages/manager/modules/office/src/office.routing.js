import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('office.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/license/office',
      dataModel: () => 'license.office.OfficeTenant',
      defaultFilterColumn: () => 'displayName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('office_title'),
      customizableColumns: () => true,
    },
  });
};
