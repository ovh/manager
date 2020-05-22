import get from 'lodash/get';

import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

const resolves = {
  goBack: /* @ngInject */ (goToDashboard) => () => goToDashboard(),
  onError: /* @ngInject */ ($translate, Alerter) => (error) => {
    Alerter.error(
      $translate.instant('domain_free_webhosting_detach_option_error', {
        error: get(error, 'data.message', error.message),
      }),
      'detach',
    );
  },
  onSuccess: /* @ngInject */ ($translate, $window, Alerter, goBack) => (
    detachResult,
  ) => {
    let successMessage;
    if (!detachResult.autoPayWithPreferredPaymentMethod) {
      successMessage = $translate.instant(
        'domain_free_webhosting_detach_option_success_with_no_payment',
        {
          billUrl: detachResult.url,
        },
      );
    } else {
      successMessage = $translate.instant(
        'domain_free_webhosting_detach_option_success_with_payment',
        {
          accountId: detachResult.paymentMethodLabel,
          billUrl: detachResult.url,
          price: detachResult.prices.withTax.text,
        },
      );
    }

    return goBack().then(() => {
      Alerter.success(successMessage, 'app.alerts.tabs');
    });
  },
  pricingType: /* @ngInject */ () => pricingConstants.PRICING_CAPACITIES.DETACH,
  workflow: /* @ngInject */ (detachableStart10m) => ({
    options: detachableStart10m,
    type: workflowConstants.WORKFLOW_TYPES.SERVICES,
  }),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.domain.product.information.detach-free-webhosting',
    {
      url: '/detach-free-webhosting',
      component: 'freeWebhostingDomainDetach',
      resolve: resolves,
      translations: { value: ['./'], format: 'json' },
    },
  );

  $stateProvider.state('app.domain.alldom.information.detach-free-webhosting', {
    url: '/detach-free-webhosting',
    component: 'freeWebhostingDomainDetach',
    resolve: resolves,
    translations: { value: ['./'], format: 'json' },
  });
};
