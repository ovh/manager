import get from 'lodash/get';
import component from './component';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  const name = 'app.account.billing.payment.method.add';

  $stateProvider.state(name, {
    url: '/add?callbackUrl',
    views: {
      '@app.account.billing.payment': {
        component: component.name,
      },
      'bankAccount@app.account.billing.payment.method.add': {
        component: 'paymentMethodAddBankAccountView',
      },
      'bankAccountOwner@app.account.billing.payment.method.add': {
        component: 'paymentMethodAddLegacyBillingAddressView',
      },
      'billingContact@app.account.billing.payment.method.add': {
        component: 'paymentMethodAddBillingContactView',
      },
    },
    resolve: {
      addSteps: /* @ngInject */ (
        model,
        OVH_PAYMENT_METHOD_INTEGRATION_TYPE,
        OVH_PAYMENT_METHOD_TYPE,
      ) => ({
        paymentMethodType: {
          name: 'paymentMethodType',
          loading: true,
          isVisible: () => true,
          isLastStep: () => {
            const paymentMethodType = model.selectedPaymentMethodType;

            return [
              OVH_PAYMENT_METHOD_INTEGRATION_TYPE.IN_CONTEXT,
              OVH_PAYMENT_METHOD_INTEGRATION_TYPE.REDIRECT,
            ].includes(paymentMethodType.integration);
          },
        },
        bankAccount: {
          name: 'bankAccount',
          position: 1,
          isVisible: () =>
            model.selectedPaymentMethodType.paymentType ===
            OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT,
          isLastStep: () => false,
        },
        bankAccountOwner: {
          name: 'bankAccountOwner',
          position: 2,
          isVisible: () =>
            model.selectedPaymentMethodType.paymentType ===
            OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT,
          isLastStep: () => true,
        },
        billingContact: {
          // for US only
          name: 'billingContact',
          position: 1,
          loading: false,
          isVisible: () =>
            model.selectedPaymentMethodType.isRequiringContactId(),
          isLastStep: () => false,
        },
        paymentMethodIntegration: {
          name: 'paymentMethodIntegration',
          position: 2,
          loading: false,
          isVisible: () =>
            model.selectedPaymentMethodType.isRequiringContactId(),
          isLastStep: () => true,
        },
      }),

      callback: /* @ngInject */ ($location) => $location.search(),

      defaultPaymentMethodIntegration: /* @ngInject */ (
        $location,
        ovhPaymentMethodHelper,
      ) => {
        return Object.keys($location.search()).length > 0
          ? ovhPaymentMethodHelper.constructor.getCallbackIntegrationTypeRelated(
              $location.search(),
            )
          : null;
      },

      getBackButtonHref: /* @ngInject */ ($state, $transition$) => () =>
        $state.href(get($transition$.params(), 'from', '^')),

      isLastStep: /* @ngInject */ (addSteps, model) => (stepName) => {
        const step = get(addSteps, stepName);
        if (step.loading || !model.selectedPaymentMethodType) {
          return true;
        }

        return step.isLastStep();
      },

      isStepVisible: /* @ngInject */ (addSteps, model) => (stepName) => {
        const step = get(addSteps, stepName);
        if (!model.selectedPaymentMethodType) {
          return false;
        }

        return step.isVisible();
      },

      model: () => ({}),

      onPaymentMethodAdded: /* @ngInject */ (
        $transition$,
        $translate,
        goPaymentList,
        RedirectionService,
        OVH_PAYMENT_METHOD_TYPE,
      ) => (paymentMethod, selectedPaymentMethodType) => {
        const { callbackUrl } = $transition$.params();
        if (callbackUrl && RedirectionService.validate(callbackUrl)) {
          window.location.href = callbackUrl;
          return callbackUrl;
        }

        return goPaymentList(
          {
            type: 'success',
            text: $translate.instant(
              selectedPaymentMethodType?.paymentType ===
                OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT
                ? 'billing_payment_method_add_sepa_success'
                : 'billing_payment_method_add_success',
            ),
          },
          get($transition$.params(), 'from', null),
        );
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_method_add_title'),
    },
  });

  $urlRouterProvider.when(/^\/billing\/mean\/add$/, ($location, $state) =>
    $state.go(name),
  );
};
