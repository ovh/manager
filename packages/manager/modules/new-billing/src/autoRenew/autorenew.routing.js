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
          ]),
        isAutorenewManagementAvailable: /* @ngInject */ (featureAvailability) =>
          featureAvailability?.isFeatureAvailable('billing:management') ||
          false,
        hideBreadcrumb: /* @ngInject */ () => true,
        trackingPrefix: () => 'dedicated::account::billing::autorenew',
      },
      !coreConfigProvider.isRegion('US')
        ? {
            agreementsLink: /* @ngInject */ ($state) =>
              $state.href(
                'billing.autorenew.agreements',
                {},
                { inherit: false },
              ),

            homeLink: /* @ngInject */ ($state) =>
              $state.href('billing.autorenew.services', {}, { inherit: false }),

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
        .then((isAutorenewManagementAvailable) =>
          !isAutorenewManagementAvailable
            ? 'billing.autorenew.ssh'
            : 'billing.autorenew.services',
        ),
  });

  $stateProvider.state('billing.autorenew.service', {
    url: '/:serviceId',
    redirectTo: 'billing.autorenew',
  });
};
