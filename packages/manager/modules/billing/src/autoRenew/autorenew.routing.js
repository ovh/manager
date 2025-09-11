import assign from 'lodash/assign';

import {
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
          if ($transition$.to()?.name === 'billing.autorenew.services') {
            BillingAutoRenew.setQueryParams($transition$.params());
          }
          return BillingAutoRenew.getQueryParams();
        },
        featureAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
          ovhFeatureFlipping.checkFeatureAvailability([
            'vrack:delete',
            'billing:management',
            'billing:autorenew2016Deployment',
            'billing:agreements',
          ]),
        isAgreementsAvailable: /* @ngInject */ (featureAvailability) =>
          featureAvailability?.isFeatureAvailable('billing:agreements') ||
          false,
        isAutorenewManagementAvailable: /* @ngInject */ (featureAvailability) =>
          featureAvailability?.isFeatureAvailable('billing:management') ||
          false,
        hideBreadcrumb: /* @ngInject */ () => true,
        trackingPrefix: () => 'dedicated::account::billing::autorenew',
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
        homeLink: /* @ngInject */ ($state, isAutorenewManagementAvailable) => {
          if (isAutorenewManagementAvailable) {
            return $state.href(
              'billing.autorenew.services',
              {},
              { inherit: false },
            );
          }
          return null;
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_title'),
        defaultPaymentMean: /* @ngInject */ (ovhPaymentMethod) =>
          ovhPaymentMethod.getDefaultPaymentMethod(),
        agreementsLink: /* @ngInject */ ($state, isAgreementsAvailable) => {
          if (isAgreementsAvailable) {
            return $state.href(
              'billing.autorenew.agreements',
              {},
              { inherit: false },
            );
          }
          return null;
        },
      },
      !coreConfigProvider.isRegion('US')
        ? {
          endStrategyEnum: /* @ngInject */ ($http) =>
            $http
              .get('/services.json')
              .then(
                ({ data }) =>
                  data.models['services.billing.engagement.EndStrategyEnum']
                    ?.enum,
              ),
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
        .then((isAutorenewManagementAvailable) => {
          if (!isAutorenewManagementAvailable) {
            return 'billing.autorenew.ssh';
          }
          return transition.to()?.name === 'billing.autorenew'
            ? 'billing.autorenew.services'
            : null;
        }),
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
