import get from 'lodash/get';

import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import component from './detach.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.detachEmail', {
    url: '/detachEmail',
    component: component.name,
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      emailOptionName: /* @ngInject */ (
        $translate,
        emailOptionDetachInformation,
      ) =>
        $translate.instant(
          `hosting_change_main_domain_${emailOptionDetachInformation[0].plancodes[0].planCode}`,
        ),
      pricingType: () => pricingConstants.PRICING_CAPACITIES.DETACH,
      workflow: /* @ngInject */ (emailOptionDetachInformation) => ({
        options: {
          ...emailOptionDetachInformation[0],
        },
        type: workflowConstants.WORKFLOW_TYPES.SERVICES,
      }),

      onError: ($translate, Alerter) => (error) => {
        Alerter.error(
          $translate.instant('hosting_email_detach_option_error', {
            error: get(error, 'data.message', error.message),
          }),
          'detach',
        );
      },
      onSuccess: /* @ngInject */ ($translate, $window, Alerter, goBack) => (
        result,
      ) => {
        let successMessage;
        if (!result.autoPayWithPreferredPaymentMethod) {
          successMessage = $translate.instant(
            'hosting_email_detach_option_success_with_no_payment',
            {
              billUrl: result.url,
            },
          );
        } else {
          successMessage = $translate.instant(
            'hosting_email_detach_option_success_with_payment',
            {
              accountId: result.paymentMethodLabel,
              billUrl: result.url,
              price: result.prices.withTax.text,
            },
          );
        }

        return goBack().then(() => {
          Alerter.success(successMessage, 'app.alerts.tabs');
        });
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_email_detach_option_title'),
    },
  });
};
