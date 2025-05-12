import get from 'lodash/get';
import map from 'lodash/map';
import range from 'lodash/range';

import { BillingService } from '@ovh-ux/manager-models';

import { NIC_ALL } from '../autorenew.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.services', {
    url: '/services',
    component: 'services',
    resolve: {
      goToAutorenew: /* @ngInject */ (
        $state,
        $timeout,
        Alerter,
        queryParameters,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go('billing.autorenew', queryParameters || {}, {
          reload,
        });

        if (message) {
          promise.then(() =>
            $timeout(() => Alerter.set(`alert-${type}`, message)),
          );
        }

        return promise;
      },
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
        $state.href('billing.autorenew.activation'),
      billingServices: /* @ngInject */ (services) =>
        map(services.list.results, (service) => new BillingService(service)),
      canDisableAllDomains: /* @ngInject */ (services) => services.bulkDomains,
      /* @ngInject */
      defaultPaymentMean: (ovhPaymentMethod) =>
        ovhPaymentMethod.getDefaultPaymentMethod(),
      disableAutorenewForDomains: /* @ngInject */ ($state) => () =>
        $state.go('billing.autorenew.disableDomainsBulk'),
      disableBulkAutorenew: /* @ngInject */ ($state) => (services) =>
        $state.go('billing.autorenew.disable', {
          services: map(services, 'id').join(','),
        }),

      enableBulkAutorenew: /* @ngInject */ ($state) => (services) =>
        $state.go('billing.autorenew.enable', {
          services: map(services, 'id').join(','),
        }),
      endStrategies: /* @ngInject */ (endStrategyEnum) =>
        endStrategyEnum.reduce(
          (object, strategy) => ({
            ...object,
            [strategy]: strategy,
          }),
          {},
        ),
      endStrategyEnum: /* @ngInject */ ($http) =>
        $http
          .get('/services.json')
          .then(
            ({ data }) =>
              data.models['services.billing.engagement.EndStrategyEnum']?.enum,
          ),
      filters: /* @ngInject */ (queryParameters) =>
        JSON.parse(queryParameters.filters),
      isEnterpriseCustomer: /* @ngInject */ (currentUser) =>
        currentUser.isEnterprise,

      hasAutoRenew: /* @ngInject */ (billingRenewHelper) => (service) =>
        billingRenewHelper.serviceHasAutomaticRenew(service),

      nicBilling: /* @ngInject */ (queryParameters) =>
        queryParameters.nicBilling,
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

      pageNumber: /* @ngInject */ (queryParameters) =>
        parseInt(queryParameters.pageNumber, 10),
      pageSize: /* @ngInject */ (queryParameters) =>
        parseInt(queryParameters.pageSize, 10),

      searchText: /* @ngInject */ (queryParameters) =>
        queryParameters.searchText,

      selectedType: /* @ngInject */ (queryParameters) =>
        queryParameters.selectedType,

      services: /* @ngInject */ (
        BillingAutoRenew,
        filters,
        nicBilling,
        pageSize,
        offset,
        searchText,
        selectedType,
        sort,
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

      sort: /* @ngInject */ (queryParameters) =>
        JSON.parse(queryParameters.sort),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_title'),
    },
    atInternet: {
      ignore: true,
    },
  });
};
