import filter from 'lodash/filter';
import find from 'lodash/find';

import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new.payment', {
    url: '/payment?paymentStatus',
    views: {
      '': component.name,

      'progress@pci.projects.new.payment': 'pciProjectNewProgress',

      'payment@pci.projects.new.payment': {
        componentProvider: /* @ngInject */ (
          defaultPaymentMethod,
          validPaymentMethods,
        ) => {
          if (defaultPaymentMethod) {
            return 'pciProjectNewPaymentDefault';
          }
          if (validPaymentMethods.length) {
            return 'pciProjectNewPaymentChoose';
          }

          return 'pciProjectNewPaymentRegister';
        },
      },

      'credits@pci.projects.new.payment': 'pciProjectNewPaymentCreditType',

      'challenge@pci.projects.new.payment': {
        componentProvider: /* @ngInject */ (eligibility) =>
          eligibility.isChallengePaymentMethodRequired()
            ? 'pciProjectNewPaymentChallenge'
            : null,
      },

      'voucher@pci.projects.new.payment': 'pciProjectNewVoucher',

      'dlp@pci.projects.new.payment': {
        componentProvider: /* @ngInject */ (dlpStatus) =>
          dlpStatus ? 'pciProjectNewPaymentDlp' : null,
      },
    },
    onEnter: /* @ngInject */ (activeStep, step) => {
      activeStep(step.name);
    },
    resolve: {
      paymentStatus: /* @ngInject */ ($transition$) =>
        $transition$.params().paymentStatus,

      paymentMethods: /* @ngInject */ (ovhPaymentMethod) =>
        ovhPaymentMethod.getAllPaymentMethods(),

      validPaymentMethods: /* @ngInject */ (
        eligibility,
        paymentMethods,
        OVH_PAYMENT_METHOD_STATUS,
      ) => {
        const validPaymentMethods = filter(paymentMethods, {
          status: OVH_PAYMENT_METHOD_STATUS.VALID,
        });
        // set valid payment methods of eligibility in order to centralize requirements
        eligibility.setValidPaymentMethods(validPaymentMethods);
        return validPaymentMethods;
      },

      defaultPaymentMethod: /* @ngInject */ (paymentMethods) =>
        find(paymentMethods, { default: true }),

      registerablePaymentMethods: /* @ngInject */ (
        eligibility,
        ovhPaymentMethod,
      ) => ovhPaymentMethod.getAllAvailablePaymentMethodTypes(),

      dlpStatus: /* @ngInject */ ($q, pciProjectNewPayment) =>
        pciProjectNewPayment.getDlpStatus().catch((error) => {
          if (error.status === 404) {
            return null;
          }
          return $q.reject(error);
        }),

      getCancelHref: /* @ngInject */ ($state) => () =>
        $state.href('pci.projects'),

      reloadPayment: /* @ngInject */ ($state) => () =>
        $state.go(
          'pci.projects.new.payment',
          {},
          {
            reload: true,
          },
        ),

      onAskCreditPayment: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.new.payment.credit', {}, { location: false }),

      onCartFinalized: /* @ngInject */ ($state, $window, cart) => ({
        orderId,
        prices,
        url,
      }) => {
        if (cart.creditOption || prices.withTax.value !== 0) {
          // if credit has been added or total checkout is not equal to 0
          // redirect to order url
          return $window.location.assign(url);
        }

        return $state.go(
          'pci.projects.creating',
          {
            orderId,
          },
          {
            location: false,
          },
        );
      },

      step: /* @ngInject */ (getStep) => getStep('payment'),
    },
  });
};
