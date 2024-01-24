import filter from 'lodash/filter';
import get from 'lodash/get';

import { CREDIT_PROVISIONING } from './components/add/constants';
import {
  PCI_PROJECT_STEPS,
  PAYMENT_RUPAY_CREDIT_CARD_CHARGES_FEATURE_ID,
} from '../constants';

import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new.payment', {
    url:
      '/payment?paymentStatus&paymentType&redirectResult&paymentMethodId&transactionId',
    params: {
      skipCallback: null,
      showError: null,
    },
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
    atInternet: {
      ignore: true, // this tell AtInternet to not track this state
    },
    onEnter: /* @ngInject */ (
      atInternet,
      activeStep,
      step,
      numProjects,
      model,
    ) => {
      activeStep(step.name);
      atInternet.trackPage({
        name: 'PublicCloud::pci::projects::new::payment',
        pciCreationNumProjects: numProjects,
      });
      if (model.voucher.valid) {
        atInternet.trackPage({
          name: `PublicCloud_new_project_free_voucher::${model.voucher.value}::payment`,
        });
      }
    },
    resolve: {
      skipCallback: /* @ngInject */ ($transition$) =>
        $transition$.params().skipCallback,
      showError: /* @ngInject */ ($transition$) =>
        $transition$.params().showError,
      callback: /* @ngInject */ ($location, $transition$) =>
        $transition$.params().skipCallback ? {} : $location.search(),
      displayErrorMessageOnIntegrationSubmitError: /* @ngInject */ (
        $translate,
        skipCallback,
        showError,
        CucCloudMessage,
      ) => {
        if (skipCallback && showError) {
          CucCloudMessage.error(
            $translate.instant('pci_project_new_payment_create_error'),
            'pci.projects.new.payment',
          );
        }
      },
      isDisplayablePaypalChargeBanner: /* @ngInject */ (ovhFeatureFlipping) => {
        const paypalChargeId = 'public-cloud:paypal-charge';
        return ovhFeatureFlipping
          .checkFeatureAvailability(paypalChargeId)
          .then((feature) => feature.isFeatureAvailable(paypalChargeId));
      },

      creditProvisioningPlan: /* @ngInject */ ($http, coreConfig) =>
        $http
          .get('/order/catalog/public/cloud', {
            params: { ovhSubsidiary: coreConfig.getUser().ovhSubsidiary },
          })
          .then(({ data: catalog }) => catalog)
          .then((catalog) => {
            return catalog.plans.find(
              ({ planCode }) => planCode === CREDIT_PROVISIONING.PLAN_CODE,
            );
          }),

      getPaymentMethod: /* @ngInject */ (ovhPaymentMethod) => (
        paymentMethodId,
      ) => ovhPaymentMethod.getPaymentMethod(paymentMethodId),

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

      hasComponentRedirectCallback: /* @ngInject */ (
        callback,
        ovhPaymentMethodHelper,
        paymentStatus,
        OVH_PAYMENT_METHOD_INTEGRATION_TYPE,
      ) => {
        const displayComponent =
          paymentStatus !== null
            ? ovhPaymentMethodHelper.constructor.getCallbackIntegrationTypeRelated(
                callback,
              )
            : null;
        return (
          displayComponent === OVH_PAYMENT_METHOD_INTEGRATION_TYPE.COMPONENT
        );
      },

      defaultPaymentMethod: /* @ngInject */ (
        paymentMethods,
        eligibility,
        model,
      ) => {
        const defaultPaymentMethod = paymentMethods.find(
          (paymentMethod) => paymentMethod.default === true,
        );
        if (defaultPaymentMethod) {
          if (eligibility.isChallengePaymentMethodRequired()) {
            Object.defineProperty(model, 'valid', {
              get: () =>
                model.challenge?.isValid(
                  defaultPaymentMethod.type.paymentType,
                ) || false,
            });
          } else {
            Object.assign(model, { valid: true });
          }
        }
        return defaultPaymentMethod;
      },

      registerablePaymentMethods: /* @ngInject */ (ovhPaymentMethod) =>
        ovhPaymentMethod.getAllAvailablePaymentMethodTypes(),

      dlpStatus: /* @ngInject */ ($q, pciProjectNewPayment) =>
        pciProjectNewPayment.getDlpStatus().catch((error) => {
          if (error.status === 404) {
            return null;
          }
          return $q.reject(error);
        }),

      getCancelHref: /* @ngInject */ ($state) => () =>
        $state.href('pci.projects'),

      step1Link: /* @ngInject */ ($state) => () => $state.href('^'),

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
          window.top.location.href = url;
          return url;
        }

        return $state.go(
          'pci.projects.creating',
          {
            orderId,
            voucherCode: get(
              cart,
              'projectItem.voucherConfiguration.value',
              '',
            ),
          },
          {
            location: false,
          },
        );
      },

      onProgressStepClick: /* @ngInject */ ($state) => ({ name, active }) => {
        if (name === PCI_PROJECT_STEPS.CONFIGURATION && !active) {
          return $state.go('^');
        }

        return null;
      },

      step: /* @ngInject */ (getStep) => getStep(PCI_PROJECT_STEPS.PAYMENT),
    },
  });
};
