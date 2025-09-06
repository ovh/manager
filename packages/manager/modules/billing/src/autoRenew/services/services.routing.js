import get from 'lodash/get';
import map from 'lodash/map';
import range from 'lodash/range';

import { BillingService } from '@ovh-ux/manager-models';

import { NIC_ALL } from '../autorenew.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.services', {
    url: '/services?refresh',
    component: 'services',
    params: {
      refresh: {
        value: 'false',
        squash: true,
        dynamic: true,
      },
    },
    resolve: {
      isAutorenew2016DeploymentBannerAvailable: /* @ngInject */ (
        featureAvailability,
      ) =>
        featureAvailability?.isFeatureAvailable(
          'billing:autorenew2016Deployment',
        ) || false,
      canDeleteVrack: /* @ngInject */ (featureAvailability) =>
        featureAvailability?.isFeatureAvailable('vrack:delete') || false,
      hideBreadcrumb: /* @ngInject */ () => true,
      trackingPrefix: () => 'dedicated::account::billing::autorenew',
      activationLink: /* @ngInject */ ($state) =>
        $state.href('billing.autorenew.services.activation'),
      billingServices: /* @ngInject */ (services) =>
        map(services.list.results, (service) => new BillingService(service)),
      canDisableAllDomains: /* @ngInject */ (services) => services.bulkDomains,
      disableAutorenewForDomains: /* @ngInject */ ($state) => () =>
        $state.go('billing.autorenew.services.disableDomainsBulk'),
      disableBulkAutorenew: /* @ngInject */ ($state) => (services) =>
        $state.go('billing.autorenew.services.disable', {
          services: map(services, 'id').join(','),
        }),

      enableBulkAutorenew: /* @ngInject */ ($state) => (services) =>
        $state.go('billing.autorenew.services.enable', {
          services: map(services, 'id').join(','),
        }),
      filters: /* @ngInject */ ($transition$, queryParameters) =>
        JSON.parse(
          $transition$.params().filters || queryParameters.filters || '{}',
        ),
      isEnterpriseCustomer: /* @ngInject */ (currentUser) =>
        currentUser.isEnterprise,

      hasAutoRenew: /* @ngInject */ (billingRenewHelper) => (service) =>
        billingRenewHelper.serviceHasAutomaticRenew(service),

      nicBilling: /* @ngInject */ ($transition$) =>
        $transition$.params().nicBilling,
      nicRenew: /* @ngInject */ (BillingAutoRenew, services) =>
        BillingAutoRenew.getAutorenew().then((nicRenew) => ({
          ...nicRenew,
          isMandatory: services.userMustApproveAutoRenew,
          renewDays: range(1, 30),
        })),

      nics: /* @ngInject */ ($translate, services) => [
        $translate.instant(NIC_ALL),
        ...get(services, 'nicBilling', []),
      ],

      offset: /* @ngInject */ (pageNumber, pageSize) =>
        pageSize * (pageNumber - 1),

      onListParamChanges: /* @ngInject */ ($state) => (params) =>
        $state.go('.', params, { notify: false }),

      pageNumber: /* @ngInject */ ($transition$) =>
        parseInt($transition$.params().pageNumber, 10),
      pageSize: /* @ngInject */ ($transition$) =>
        parseInt($transition$.params().pageSize, 10),

      searchText: /* @ngInject */ ($transition$) =>
        $transition$.params().searchText,

      selectedType: /* @ngInject */ ($transition$, queryParameters) =>
        $transition$.params().selectedType || queryParameters.selectedType,

      refresh: /* @ngInject */ ($transition$, queryParameters) =>
        $transition$.params().refresh === 'true' ||
        queryParameters.refresh === 'true',

      services: /* @ngInject */ (
        $state,
        BillingAutoRenew,
        filters,
        nicBilling,
        pageSize,
        offset,
        searchText,
        selectedType,
        sort,
        refresh,
      ) =>
        BillingAutoRenew.getServices(
          pageSize,
          offset,
          searchText,
          selectedType,
          filters.expiration,
          filters.status,
          filters.state,
          sort,
          nicBilling,
          refresh,
        ),

      choiceRenewDayTooltipAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(['billing:choiceRenewDayTooltip'])
          .then((commitmentAvailability) =>
            commitmentAvailability?.isFeatureAvailable(
              'billing:choiceRenewDayTooltip',
            ),
          ),

      serviceTypes: /* @ngInject */ (BillingAutoRenew, services) =>
        BillingAutoRenew.getServicesTypes(services),

      sort: /* @ngInject */ ($transition$) =>
        JSON.parse($transition$.params().sort || '{}'),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_title'),
    },
    atInternet: {
      ignore: true,
    },
  });
};
