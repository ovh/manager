import assign from 'lodash/assign';
import get from 'lodash/get';
import map from 'lodash/map';
import range from 'lodash/range';

import { BillingService } from '@ovh-ux/manager-models';

import { NIC_ALL } from './autorenew.constants';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  $stateProvider.state('app.account.billing.autorenewRedirection', {
    url:
      '/autoRenew?selectedType&pageSize&pageNumber&filters&searchText&nicBilling&sort',
    redirectTo: 'app.account.billing.autorenew',
  });

  $stateProvider.state('app.account.billing.autorenew', {
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
          $state.href(
            'app.account.billing.autorenew.ssh',
            {},
            { inherit: false },
          ),
      },
      coreConfigProvider.region !== 'US'
        ? {
            activationLink: /* @ngInject */ ($state) =>
              $state.href('app.account.billing.autorenew.activation'),
            agreementsLink: /* @ngInject */ ($state) =>
              $state.href(
                'app.account.billing.autorenew.agreements',
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
              $state.go('app.account.billing.autorenew.disableDomainsBulk'),
            disableBulkAutorenew: /* @ngInject */ ($state) => (services) =>
              $state.go('app.account.billing.autorenew.disable', {
                services: map(services, 'id').join(','),
              }),

            enableBulkAutorenew: /* @ngInject */ ($state) => (services) =>
              $state.go('app.account.billing.autorenew.enable', {
                services: map(services, 'id').join(','),
              }),
            filters: /* @ngInject */ ($transition$) =>
              JSON.parse($transition$.params().filters),
            isEnterpriseCustomer: /* @ngInject */ (currentUser) =>
              currentUser.isEnterprise,

            goToAutorenew: /* @ngInject */ ($state, $timeout, Alerter) => (
              message = false,
              type = 'success',
            ) => {
              const reload = message && type === 'success';

              const promise = $state.go(
                'app.account.billing.autorenew',
                {},
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

            hasAutoRenew: /* @ngInject */ (billingRenewHelper) => (service) =>
              billingRenewHelper.serviceHasAutomaticRenew(service),

            homeLink: /* @ngInject */ ($state) =>
              $state.href(
                'app.account.billing.autorenew',
                {},
                { inherit: false },
              ),

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

            serviceTypes: /* @ngInject */ (BillingAutoRenew, services) =>
              BillingAutoRenew.getServicesTypes(services),

            sort: /* @ngInject */ ($transition$) =>
              JSON.parse($transition$.params().sort),
          }
        : {},
    ),
    redirectTo: /* @ngInject */ () =>
      coreConfigProvider.region === 'US'
        ? 'app.account.billing.autorenew.ssh'
        : false,
  });
};
