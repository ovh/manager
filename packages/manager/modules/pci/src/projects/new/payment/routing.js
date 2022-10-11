import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';

import { CREDIT_PROVISIONING } from './components/add/constants';
import { PCI_PROJECT_STEPS } from '../constants';

import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new.payment', {
    url: '/payment?paymentStatus&paymentType',
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
    onEnter: /* @ngInject */ (atInternet, activeStep, step, numProjects) => {
      activeStep(step.name);
      atInternet.trackPage({
        name: 'PublicCloud::pci::projects::new::payment',
        pciCreationNumProjects: numProjects,
      });
    },
    resolve: {
      callback: /* @ngInject */ ($location) => $location.search(),

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
