import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { telephonyServices } from '@ovh-ux/manager-product-listing-configuration';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.services', {
    url: `/services?${ListLayoutHelper.urlQueryParams}`,
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: /* @ngInject */ (billingAccountId) =>
        `/telephony/${billingAccountId}/service`,
      schema: /* @ngInject */ (OvhApiTelephony) =>
        OvhApiTelephony.v6().schema().$promise,
      dataModel: /* @ngInject */ (schema) =>
        schema.models['telephony.TelephonyService'],
      columnConfig: () => telephonyServices.getConfig(),

      id: () => 'telephony-billingAccounts-services',
      defaultFilterProperty: () => 'serviceName',

      getServiceNameLink: /* @ngInject */ (
        billingAccountId,
        telecomBillingAccount,
      ) => (service) =>
        telecomBillingAccount.getServiceLink(billingAccountId, service),

      options: /* @ngInject */ ($translate, viewService) => [
        {
          id: 'details',
          label: $translate.instant(
            'telephony_billing_account_services_view_label',
          ),
          callback: (value) => viewService(value),
        },
      ],

      viewService: /* @ngInject */ (
        $state,
        billingAccountId,
        telecomBillingAccount,
      ) => (service) => {
        const {
          state,
          stateParams,
        } = telecomBillingAccount.constructor.getServiceState(
          billingAccountId,
          service,
        );
        return $state.go(state, stateParams);
      },
    },
  });
};
