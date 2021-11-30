import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './repayments.controller';
import template from './repayments.html';
import { COLUMNS } from './repayments.constants';
import { transformRepayments } from './repayments.helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('telecom.telephony.repayments', {
      url: '/repayments',
      views: {
        'telephonyView@telecom.telephony': {
          controller,
          template,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_repayments_title'),
      },
    })
    .state('telecom.telephony.repayments.index', {
      url: `?${ListLayoutHelper.urlQueryParams}`,
      views: {
        listView: {
          component: 'managerListLayout',
        },
      },
      params: ListLayoutHelper.stateParams,
      resolve: {
        ...ListLayoutHelper.stateResolves,
        resources: /* @ngInject */ ($http) =>
          $http
            .get('/me/sva/cdr', {
              headers: {
                'X-Pagination-Mode': 'CachedObjectList-Pages',
                'X-Pagination-Filter': 'status:in=CREATED,PAID',
              },
            })
            .then(({ data }) => transformRepayments(data)),
        apiPath: () => '/me/sva/cdr',
        dataModel: () => 'me.sva.Cdr',
        columns: /* @ngInject */ ($translate) =>
          COLUMNS.map((column) => ({
            ...column,
            title: $translate.instant(
              `telephony_repayments_grid_${column.property}`,
            ),
          })),
        schema: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().schema().$promise,
        staticResources: () => true,
        defaultFilterColumn: () => 'calledNumber',
        customizableColumns: () => true,
        hideBreadcrumb: () => true,
      },
    });
};
