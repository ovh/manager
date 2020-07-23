import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { telephony } from '@ovh-ux/manager-product-listing-configuration';
import template from './telecom-telephony.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony', {
    url: '/telephony',
    abstract: true,
    views: {
      'telecomView@telecom': {
        template,
      },
    },
  });

  $stateProvider.state('telecom.telephony.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      'telephonyView@telecom.telephony': {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/telephony',
      loadResource: /* @ngInject */ (OvhApiTelephonyService) => (resource) =>
        OvhApiTelephonyService.v6()
          .query({
            billingAccount: resource.billingAccount,
          })
          .$promise.then((services) => ({
            ...resource,
            numServices: services.length,
          })),

      schema: /* @ngInject */ (OvhApiTelephony) =>
        OvhApiTelephony.v6().schema().$promise,

      dataModel: /* @ngInject */ (schema) =>
        schema.models['telephony.BillingAccount'],

      columnConfig: () => telephony.getConfig(),
      header: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_title'),

      id: () => 'telephony-billingAccounts',
      defaultFilterProperty: () => 'billingAccount',

      getServiceNameLink: /* @ngInject */ ($state) => ({ billingAccount }) =>
        $state.href('telecom.telephony.billingAccount', {
          billingAccount,
        }),

      options: /* @ngInject */ (
        $translate,
        viewBillingAccount,
        viewBillingAccountServices,
      ) => [
        {
          id: 'details',
          label: $translate.instant('telephony_view_billing_account_label'),
          callback: (value) => viewBillingAccount(value),
        },
        {
          id: 'servicesDetails',
          label: $translate.instant(
            'telephony_view_billing_account_service_services',
          ),
          callback: (value) => viewBillingAccountServices(value),
        },
      ],

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
    },
  });
};
