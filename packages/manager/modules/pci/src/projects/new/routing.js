import get from 'lodash/get';
import find from 'lodash/find';
import set from 'lodash/set';

import EnvironmentService from '@ovh-ux/manager-config';

import component from './component';

import PciEligibility from './classes/eligibility.class';
import PciVoucher from './components/voucher/voucher.class';
import PciPaymentMethodChallenge from './payment/components/challenge/challenge.class';

import {
  ELIGIBILITY_ACTION_ENUM,
  ELIGIBILITY_ERROR_IMAGES_SRC,
} from './constants';

import { PCI_REDIRECT_URLS } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new', {
    url: '/new?cartId&voucher',
    redirectTo: (transition) => {
      const translatePromise = transition.injector().getAsync('$translate');
      const windowPromise = transition.injector().getAsync('$window');
      const cartPromise = transition.injector().getAsync('cart');
      const eligibilityPromise = transition.injector().getAsync('eligibility');
      const newSupportTicketLink = transition
        .injector()
        .get('newSupportTicketLink');
      return Promise.all([
        translatePromise,
        windowPromise,
        cartPromise,
        eligibilityPromise,
      ]).then(([$translate, $window, cart, eligibility]) => {
        let redirectState = 'pci.projects.new.config';
        let redirectParams = transition.params();
        const redirectOptions = {
          location: false,
        };

        if (eligibility.isAskIncreaseProjectsQuotaRequired()) {
          redirectState = 'pci.projects.project.error';
          redirectParams = {
            message: $translate.instant(
              'pci_project_new_error_ask_increase_projects_quota',
            ),
            code: ELIGIBILITY_ACTION_ENUM.ASK_INCREASE_PROJECTS_QUOTA,
            image: ELIGIBILITY_ERROR_IMAGES_SRC.ASK_INCREASE_PROJECTS_QUOTA,
            projectId: get(transition.params('from'), 'projectId'),
            submitLabel: $translate.instant(
              'pci_project_new_error_contact_support',
            ),
            submitLink: newSupportTicketLink,
          };
        } else if (eligibility.isVerifyPaypalRequired()) {
          redirectState = 'pci.error';
          redirectParams = {
            message: $translate.instant('pci_project_new_error_verify_paypal', {
              href: get(
                PCI_REDIRECT_URLS,
                `${EnvironmentService.Environment.region}.paymentMethods`,
              ),
            }),
            code: ELIGIBILITY_ACTION_ENUM.VERIFY_PAYPAL,
            image: ELIGIBILITY_ERROR_IMAGES_SRC.VERIFY_PAYPAL,
            submitLabel: null,
          };
        } else if (cart.cartId !== transition.params().cartId) {
          $window.location.replace(
            transition.router.stateService.href('pci.projects.new', {
              cartId: cart.cartId,
            }),
          );
          return null;
        }

        return transition.router.stateService.target(
          redirectState,
          redirectParams,
          redirectOptions,
        );
      });
    },
    views: {
      '@pci': component.name,
    },
    resolve: {
      breadcrumb: () => null,

      newSupportTicketLink: /* @ngInject */ (RedirectionService) =>
        RedirectionService.getURL('createTicket'),

      cart: /* @ngInject */ ($transition$, me, pciProjectNew) =>
        !get($transition$.params(), 'cartId')
          ? // just create cart - location will be reloaded to fetch the whole cart
            pciProjectNew.createOrderCart(me.ovhSubsidiary)
          : pciProjectNew.getOrderCart(
              me.ovhSubsidiary,
              get($transition$.params(), 'cartId'),
            ),

      eligibility: /* @ngInject */ ($transition$, pciProjectNew) =>
        pciProjectNew
          .checkEligibility(get($transition$.params(), 'voucher'))
          .then((eligibility) => new PciEligibility(eligibility)),

      checkVoucherValidity: /* @ngInject */ (pciProjectNew) => (voucher) =>
        pciProjectNew.checkEligibility(voucher).catch((error) => ({
          voucher: {
            error: error.status,
          },
        })),

      /* ----------  Shared model definition  ---------- */

      model: /* @ngInject */ (
        cart,
        checkVoucherValidity,
        eligibility,
        ovhPaymentMethodHelper,
      ) => {
        const modelDef = {
          agreements: false,
          credit: null,
          challenge: new PciPaymentMethodChallenge(
            {},
            ovhPaymentMethodHelper.isValidIban,
          ),
          description: get(
            cart,
            'projectItem.descriptionConfiguration.value',
            null,
          ),
          paymentMethod: null,
          defaultPaymentMethod: null,
          voucher: new PciVoucher({
            value: get(cart, 'projectItem.voucherConfiguration.value'),
          }),
        };

        if (modelDef.voucher.value) {
          return checkVoucherValidity(modelDef.voucher.value).then(
            (eligibilityOpts) => {
              // update eligibility instance
              eligibility.setOptions(eligibilityOpts);
              // set some information to voucher model
              modelDef.voucher.setInfos(eligibilityOpts.voucher);
              // return the model
              return modelDef;
            },
          );
        }

        return modelDef;
      },

      globalLoading: () => ({
        setDefaultPaymentMethod: false,
        finalize: false,
      }),

      /* ----------  Order steps management  ---------- */

      getStep: /* @ngInject */ (steps) => (name) => find(steps, { name }),

      activeStep: /* @ngInject */ (getStep, steps) => (name) => {
        // desactive all steps
        steps.forEach((step) => {
          set(step, 'active', false);
        });

        // active the step with given name
        const activeStep = getStep(name);
        set(activeStep, 'active', true);
      },

      steps: () => [
        {
          name: 'configuration',
          active: false,
        },
        {
          name: 'payment',
          active: false,
        },
      ],
    },
  });
};
