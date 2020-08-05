import get from 'lodash/get';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      'telephonyView@telecom.telephony': {
        component: 'telecomTelephony',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/telephony',
      defaultFilterColumn: () => 'billingAccount',
      dataModel: () => 'telephony.BillingAccount',
      loadResource: /* @ngInject */ (OvhApiTelephonyService) => (resource) =>
        OvhApiTelephonyService.v6()
          .query({
            billingAccount: resource.billingAccount,
          })
          .$promise.then((services) => ({
            ...resource,
            numServices: services.length,
          })),
      telephonyStatusTypes: /* @ngInject */ (schema) =>
        get(schema.models, 'telephony.BillingAccountStatusEnum').enum,

      getBillingAccountLink: /* @ngInject */ ($state) => ({ billingAccount }) =>
        $state.href('telecom.telephony.billingAccount', {
          billingAccount,
        }),
      getBillingAccountServicesLink: /* @ngInject */ ($state) => ({
        billingAccount,
      }) =>
        $state.href('telecom.telephony.billingAccount.services', {
          billingAccount,
        }),

      viewBillingAccount: /* @ngInject */ ($state) => ({ billingAccount }) =>
        $state.go('telecom.telephony.billingAccount', {
          billingAccount,
        }),
      viewBillingAccountServices: /* @ngInject */ ($state) => ({
        billingAccount,
      }) =>
        $state.go('telecom.telephony.billingAccount.services', {
          billingAccount,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
