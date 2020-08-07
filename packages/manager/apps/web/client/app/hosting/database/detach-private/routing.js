import get from 'lodash/get';

import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import component from './component';

export default /* @ngInject */ function($stateProvider) {
  $stateProvider.state('app.hosting.dashboard.database.detachPrivate', {
    url: '/detach',
    component: component.name,
    resolve: {
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.hosting.dashboard'),
      pricingType: /* @ngInject */ () =>
        pricingConstants.PRICING_CAPACITIES.DETACH,
      workflow: /* @ngInject */ (privateDatabasesDetachable) => ({
        options: {
          ...privateDatabasesDetachable[0],
        },
        type: workflowConstants.WORKFLOW_TYPES.SERVICES,
      }),
      onError: ($translate, Alerter) => (error) => {
        Alerter.error(
          $translate.instant('hosting_database_private_detach_option_error', {
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
            'hosting_database_private_detach_option_success_with_no_payment',
            {
              billUrl: detachResult.url,
            },
          );
        } else {
          successMessage = $translate.instant(
            'hosting_database_private_detach_option_success_with_payment',
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
    },
    translations: { value: ['.'], format: 'json' },
  });
}
