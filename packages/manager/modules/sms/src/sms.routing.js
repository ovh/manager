import get from 'lodash/get';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
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
      defaultFilterColumn: () => 'name',
      dataModel: () => 'sms.Account',
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
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 ? 'sms.onboarding' : false,
        ),
  });
};
