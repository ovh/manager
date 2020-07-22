import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { sms } from '@ovh-ux/manager-product-listing-configuration';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      '': {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      apiPath: () => '/sms',
      header: /* @ngInject */ ($translate) => $translate.instant('sms_title'),
      datagridId: () => 'sms',
      defaultFilterColumn: () => 'name',
      columnConfig: () => sms.getConfig(),

      ...ListLayoutHelper.stateResolves,

      schema: /* @ngInject */ (OvhApiSms) => OvhApiSms.v6().schema().$promise,
      dataModel: /* @ngInject */ (schema) => schema.models['sms.Account'],

      getServiceNameLink: /* @ngInject */ ($state) => ({ name: serviceName }) =>
        $state.href('sms.service.dashboard', {
          serviceName,
        }),
      viewSms: /* @ngInject */ ($state) => ({ name: serviceName }) =>
        $state.go('sms.service.dashboard', {
          serviceName,
        }),

      options: /* @ngInject */ ($translate, viewSms) => [
        {
          id: 'details',
          label: $translate.instant('sms_view_sms_label'),
          callback: (item) => viewSms(item),
        },
      ],
    },
  });
};
