import { uiRouterListPagination } from '@ovh-ux/ng-ovh-telecom-universe-components';
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
    url: `?${uiRouterListPagination.urlQueryParams}`,
    views: {
      'telephonyView@telecom.telephony': {
        component: 'telecomTelephony',
      },
    },
    params: uiRouterListPagination.stateParams,
    resolve: {
      ...uiRouterListPagination.stateResolves,
      apiPath: () => '/telephony',
      loadResource: /* @ngInject */ OvhApiTelephonyService => resource => OvhApiTelephonyService
        .v6()
        .query({
          billingAccount: resource.billingAccount,
        })
        .$promise
        .then(services => ({
          ...resource,
          numServices: services.length,
        })),

      getBillingAccountLink: /* @ngInject */ $state => ({ billingAccount }) => $state.href(
        'telecom.telephony.billingAccount',
        {
          billingAccount,
        },
      ),
      getBillingAccountServicesLink: /* @ngInject */ $state => ({ billingAccount }) => $state.href(
        'telecom.telephony.billingAccount.services',
        {
          billingAccount,
        },
      ),
    },
  });
};
