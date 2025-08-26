import get from 'lodash/get';
import component from './component';
import { PAYMENT_RUPAY_CREDIT_CARD_CHARGES_FEATURE_ID } from './constants';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  const name = 'billing.payment.method.add';

  $stateProvider.state(name, {
    url: '/add?callbackUrl&status&redirectResult&paymentMethodId&transactionId',
    views: {
      '@billing.payment': {
        component: component.name,
      },
      'bankAccount@billing.payment.method.add': {
        component: 'paymentMethodAddBankAccountView',
      },
      'bankAccountOwner@billing.payment.method.add': {
        component: 'paymentMethodAddLegacyBillingAddressView',
      },
      'billingContact@billing.payment.method.add': {
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

      isDisplayableRupayCreditCardInfoBanner: /* @ngInject */ (
        ovhFeatureFlipping,
      ) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(
            PAYMENT_RUPAY_CREDIT_CARD_CHARGES_FEATURE_ID,
          )
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(
              PAYMENT_RUPAY_CREDIT_CARD_CHARGES_FEATURE_ID,
            ),
          ),

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
      status: /* @ngInject */ ($transition$) => $transition$.params().status,
      redirectResult: /* @ngInject */ ($transition$) =>
        $transition$.params().redirectResult,
      onPaymentMethodAdded: /* @ngInject */ (
        $transition$,
        $injector,
        $translate,
        $state,
        goPaymentList,
        RedirectionService,
        OVH_PAYMENT_METHOD_TYPE,
      ) => (selectedPaymentMethodType, isDefault) => {
        const { callbackUrl } = $transition$.params();
        if (callbackUrl && RedirectionService.validate(callbackUrl)) {
          window.top.location.href = callbackUrl;
          return callbackUrl;
        }

        let message = $translate.instant(
          selectedPaymentMethodType?.paymentType ===
            OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT
            ? 'billing_payment_method_add_sepa_success'
            : 'billing_payment_method_add_status_success',
        );
        if (isDefault) {
          const autorenewLink = $state.href('billing.autorenew', {
            filters: JSON.stringify({ status: 'manual' }),
          });
          message = `${message}<br>${$translate.instant(
            'billing_payment_method_add_default_info_auto_renew',
            { autorenewLink },
          )}`;
        }

        return goPaymentList(
          {
            type: 'success',
            text: message,
          },
          get($transition$.params(), 'from', null),
        );
      },
      onPaymentMethodAddError: /* @ngInject */ (
        $transition$,
        $translate,
        goPaymentList,
      ) => (error) => {
        return goPaymentList(
          {
            type: 'error',
            text: $translate.instant('billing_payment_method_add_error', {
              errorMessage: get(error, 'data.message'),
            }),
          },
          get($transition$.params(), 'from', null),
        );
      },
      goToPaymentListPage: /* @ngInject */ (
        $translate,
        status,
        redirectResult,
        goPaymentList,
      ) => {
        const MESSAGE_TYPE = {
          error: 'error',
          failure: 'error',
          pending: 'info',
          cancel: 'error',
          success: 'success',
        };
        if (status && !redirectResult) {
          goPaymentList({
            type: MESSAGE_TYPE[status],
            text: $translate.instant(
              `billing_payment_method_add_status_${status}`,
            ),
          });
        }
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_method_add_title'),
    },
    onExit: /* @ngInject */ (shellClient) => {
      shellClient.ux.notifyModalActionDone('PaymentModal');
    },
  });

  $urlRouterProvider.when(/^\/billing\/mean\/add$/, ($location, $state) =>
    $state.go(name),
  );
};
