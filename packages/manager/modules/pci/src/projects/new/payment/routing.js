import filter from 'lodash/filter';
import get from 'lodash/get';

import {
  CREDIT_PROVISIONING,
  PAYMENTS_PER_LINE,
} from './components/add/constants';
import {
  PCI_PROJECT_STEPS,
  PAYMENT_RUPAY_CREDIT_CARD_CHARGES_FEATURE_ID,
} from '../constants';

import { PCI_NEW_PAYMENT_STATE_NAME } from '../routing';

import component from './component';

export const registerPCINewPaymentState = (
  $stateProvider,
  {
    stateName = PCI_NEW_PAYMENT_STATE_NAME,
    url = '/payment',
    configStep = true,
    views = {
      default: '',
      progress: 'progress',
      payment: 'payment',
      credits: 'credits',
      challenge: 'challenge',
      voucher: 'voucher',
      dlp: 'dlp',
    },
    viewOptions = {
      title: true,
      subtitlesSize: 2,
      voucherView: true,
      foldVoucher: true,
      denseVoucher: false,
      clearableVoucher: true,
      paymentsPerLine: PAYMENTS_PER_LINE,
      registerExplanationTexts: null,
      submitText: '',
      trackingPrefix: 'pci_project_new_payment_',
      onSubmit: null,
      stateName: PCI_NEW_PAYMENT_STATE_NAME,
    },
    resolve,
  } = {},
) => {
  const onEnter = (atInternet, numProjects, model) => {
    atInternet.trackPage({
      name: 'PublicCloud::pci::projects::new::payment',
      pciCreationNumProjects: numProjects,
    });
    if (model.voucher.valid) {
      atInternet.trackPage({
        name: `PublicCloud_new_project_free_voucher::${model.voucher.value}::payment`,
      });
    }
  };

  $stateProvider.state(stateName, {
    url: `${url}?paymentStatus&paymentType&redirectResult&paymentMethodId&transactionId`,
    params: {
      skipCallback: null,
      showError: null,
    },
    views: {
      '': component.name,
      ...(configStep && {
        [`${views.progress}@${stateName}`]: 'pciProjectNewProgress',
      }),
      [`${views.credits}@${stateName}`]: 'pciProjectNewPaymentCreditType',
      [`${views.voucher}@${stateName}`]: 'pciProjectNewVoucher',
      [`${views.payment}@${stateName}`]: {
        componentProvider: /* @ngInject */ (defaultPaymentMethod) =>
          defaultPaymentMethod
            ? 'pciProjectNewPaymentDefault'
            : 'pciProjectNewPaymentRegister',
      },
      [`${views.challenge}@${stateName}`]: {
        componentProvider: /* @ngInject */ (eligibility) =>
          eligibility.isChallengePaymentMethodRequired()
            ? 'pciProjectNewPaymentChallenge'
            : null,
      },
      [`${views.dlp}@${stateName}`]: {
        componentProvider: /* @ngInject */ (dlpStatus) =>
          dlpStatus ? 'pciProjectNewPaymentDlp' : null,
      },
    },
    atInternet: {
      ignore: true,
    },
    ...(configStep && {
      onEnter: /* @ngInject */ (
        atInternet,
        activeStep,
        step,
        numProjects,
        model,
      ) => {
        activeStep(step.name);
        onEnter(atInternet, numProjects, model);
      },
    }),
    ...(!configStep && {
      onEnter: /* @ngInject */ (atInternet, numProjects, model) => {
        onEnter(atInternet, numProjects, model);
      },
    }),
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
        ovhPaymentMethod.getPaymentMethods(),

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
        } else {
          Object.assign(model, {
            valid: eligibility.actionsRequired.length === 0,
          });
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

      reloadPayment: /* @ngInject */ ($state) => () =>
        $state.go(stateName, {}, { reload: true }),

      onAskCreditPayment: /* @ngInject */ ($state) => () =>
        $state.go(`${stateName}.credit`, {}, { location: false }),

      onCartFinalized: /* @ngInject */ ($state, cart, ovhShell) => ({
        orderId,
        prices,
        url: redirectUrl,
      }) => {
        ovhShell.tracking.trackMixCommanderS3({
          name: 'PCI project creation',
          tc_additional_params: {
            pcat: 'publiccloud',
            ot: 'pci_project_creation',
            conversion_date: new Date().toISOString(),
            pci_mode: 'full',
            pci_voucher: cart.projectItem?.voucherConfiguration?.value || '',
          },
        });

        if (cart.creditOption || prices.withTax.value !== 0) {
          window.top.location.href = redirectUrl;
          return redirectUrl;
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

      ...(configStep && {
        step1Link: /* @ngInject */ ($state) => () => $state.href('^'),

        onProgressStepClick: /* @ngInject */ ($state) => ({ name, active }) => {
          if (name === PCI_PROJECT_STEPS.CONFIGURATION && !active) {
            return $state.go('^');
          }

          return null;
        },

        step: /* @ngInject */ (getStep) => getStep(PCI_PROJECT_STEPS.PAYMENT),
      }),

      viewOptions: () => viewOptions,

      ...resolve,
    },
  });
};

export default /* @ngInject */ ($stateProvider) => {
  registerPCINewPaymentState($stateProvider);
};
