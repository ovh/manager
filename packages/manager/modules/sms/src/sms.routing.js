import get from 'lodash/get';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms', {
    url: '/sms',
    abstract: true,
  });

  $stateProvider.state('sms.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      '': {
        component: 'ovhManagerSms',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      apiPath: () => '/sms',
      ...ListLayoutHelper.stateResolves,
      schema: /* @ngInject */ (OvhApiSms) => OvhApiSms.v6().schema().$promise,
      smsStatusTypes: /* @ngInject */ (schema) =>
        get(schema.models, 'sms.StatusAccountEnum').enum,

      getSmsLink: /* @ngInject */ ($state) => ({ name: serviceName }) =>
        $state.href('sms.service.dashboard', {
          serviceName,
        }),
      viewSms: /* @ngInject */ ($state) => ({ name: serviceName }) =>
        $state.go('sms.service.dashboard', {
          serviceName,
        }),
    },
  });
};
