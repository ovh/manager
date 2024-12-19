import assign from 'lodash/assign';
import get from 'lodash/get';
import map from 'lodash/map';
import range from 'lodash/range';

import { BillingService } from '@ovh-ux/manager-models';

import {
  NIC_ALL,
  TRACKING_AUTORENEW_PAGE_NAME,
  TRACKING_PAGE_CATEGORY,
} from './autorenew.constants';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  $stateProvider.state('billing.autorenewRedirection', {
    url:
      '/autoRenew?selectedType&pageSize&pageNumber&filters&searchText&nicBilling&sort',
    redirectTo: 'billing.autorenew',
  });

  $stateProvider.state('billing.autorenew', {
    url:
      '/autorenew?selectedType&pageSize&pageNumber&filters&searchText&nicBilling&sort',
    component: 'autoRenew',
    translations: { value: ['.'], format: 'json' },
    params: {
      filters: {
        value: '{}',
        squash: true,
      },
      nicBilling: {
        value: null,
        squash: true,
      },
      pageNumber: {
        value: '1',
        squash: true,
      },
      pageSize: {
        value: '25',
        squash: true,
      },
      searchText: {
        value: null,
        squash: true,
      },
      selectedType: {
        value: null,
        squash: true,
      },
      sort: {
        value: JSON.stringify({ predicate: 'serviceId', reverse: false }),
        squash: true,
      },
    },
    resolve: assign(
      {
        currentActiveLink: /* @ngInject */ ($state) => () =>
          $state.href($state.current.name, {}, { inherit: false }),
        sshLink: /* @ngInject */ ($state) =>
          $state.href('billing.autorenew.ssh', {}, { inherit: false }),
        queryParameters: /* @ngInject */ ($transition$, BillingAutoRenew) => {
          if ($transition$.to()?.name === 'billing.autorenew') {
            BillingAutoRenew.setQueryParams($transition$.params());
          }
          return BillingAutoRenew.getQueryParams();
        },
        goToAutorenew: /* @ngInject */ (
          $state,
          $timeout,
          Alerter,
          queryParameters,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'billing.autorenew',
            queryParameters || {},
            {
              reload,
            },
          );

          if (message) {
            promise.then(() =>
              $timeout(() => Alerter.set(`alert-${type}`, message)),
            );
          }

          return promise;
        },
        featureAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
          ovhFeatureFlipping.checkFeatureAvailability([
            'billing:management',
            'billing:autorenew2016Deployment',
          ]),
        isAutorenewManagementAvailable: /* @ngInject */ (featureAvailability) =>
          featureAvailability?.isFeatureAvailable('billing:management') ||
          false,
        isAutorenew2016DeploymentBannerAvailable: /* @ngInject */ (
          featureAvailability,
        ) =>
          featureAvailability?.isFeatureAvailable(
            'billing:autorenew2016Deployment',
          ) || false,
        hideBreadcrumb: /* @ngInject */ () => true,
        trackingPrefix: () => 'dedicated::account::billing::autorenew',
      },
      !coreConfigProvider.isRegion('US')
        ? {
            activationLink: /* @ngInject */ ($state) =>
              $state.href('billing.autorenew.activation'),
            agreementsLink: /* @ngInject */ ($state) =>
              $state.href(
                'billing.autorenew.agreements',
                {},
                { inherit: false },
              ),
            billingServices: /* @ngInject */ (services) =>
              map(
                services.list.results,
                (service) => new BillingService(service),
              ),
            canDisableAllDomains: /* @ngInject */ (services) =>
              services.bulkDomains,
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
                    data.models['services.billing.engagement.EndStrategyEnum']
                      ?.enum,
                ),
            filters: /* @ngInject */ ($transition$) =>
              JSON.parse($transition$.params().filters),
            isEnterpriseCustomer: /* @ngInject */ (currentUser) =>
              currentUser.isEnterprise,

            hasAutoRenew: /* @ngInject */ (billingRenewHelper) => (service) =>
              billingRenewHelper.serviceHasAutomaticRenew(service),

            homeLink: /* @ngInject */ ($state) =>
              $state.href('billing.autorenew', {}, { inherit: false }),

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

            selectedType: /* @ngInject */ ($transition$) =>
              $transition$.params().selectedType,

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

            choiceRenewDayTooltipAvailable: /* @ngInject */ (
              ovhFeatureFlipping,
            ) =>
              ovhFeatureFlipping
                .checkFeatureAvailability(['billing:choiceRenewDayTooltip'])
                .then((commitmentAvailability) =>
                  commitmentAvailability.isFeatureAvailable(
                    'billing:choiceRenewDayTooltip',
                  ),
                ),

            serviceTypes: /* @ngInject */ (BillingAutoRenew, services) =>
              BillingAutoRenew.getServicesTypes(services),

            sort: /* @ngInject */ ($transition$) =>
              JSON.parse($transition$.params().sort),

            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('billing_title'),
          }
        : {},
    ),
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage({
        name: TRACKING_AUTORENEW_PAGE_NAME,
        page_category: TRACKING_PAGE_CATEGORY,
      });
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('isAutorenewManagementAvailable')
        .then(
          (isAutorenewManagementAvailable) =>
            !isAutorenewManagementAvailable && 'billing.autorenew.ssh',
        ),
  });

  $stateProvider.state('billing.autorenew.service', {
    url: '/:serviceId',
    template: '<div ui-view></div>',
    redirectTo: 'billing.autorenew',
    resolve: {
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      service: /* @ngInject */ (BillingAutoRenew, serviceId) =>
        BillingAutoRenew.findService({ serviceId }),
      breadcrumb: /* @ngInject */ (serviceId) => serviceId,
    },
  });
};
