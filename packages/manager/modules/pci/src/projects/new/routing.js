import get from 'lodash/get';
import has from 'lodash/has';
import find from 'lodash/find';
import set from 'lodash/set';

import component from './component';

import PciEligibility from './classes/eligibility.class';
import PciVoucher from './components/voucher/voucher.class';
import PciPaymentMethodChallenge from './payment/components/challenge/challenge.class';

import { PCI_FEATURES } from '../projects.constant';
import {
  ELIGIBILITY_ACTION_ENUM,
  ELIGIBILITY_ERROR_IMAGES_SRC,
  PCI_PROJECT_STEPS,
} from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new', {
    url: '/new?cartId&voucher',
    onEnter: /* @ngInject */ ($injector, pciFeatureRedirect) => {
      if ($injector.has('ovhShell')) {
        const ovhShell = $injector.get('ovhShell');
        ovhShell.ux.hidePreloader();
      }
      return pciFeatureRedirect(PCI_FEATURES.OTHERS.CREATE_PROJECT);
    },
    redirectTo: (transition) => {
      const injector = transition.injector();
      injector.getAsync('$injector').then((i) => {
        if (i.has('ovhShell')) {
          const ovhShell = i.get('ovhShell');
          ovhShell.ux.showPreloader();
        }
      });
      const translatePromise = injector.getAsync('$translate');
      const windowPromise = injector.getAsync('$window');
      const coreURLBuilderPromise = injector.getAsync('coreURLBuilder');
      const cartPromise = injector.getAsync('cart');
      const eligibilityPromise = injector.getAsync('eligibility');
      const newSupportTicketLinkPromise = injector.getAsync(
        'newSupportTicketLink',
      );
      const trackProjectCreationErrorPromise = injector.getAsync(
        'trackProjectCreationError',
      );

      return Promise.all([
        translatePromise,
        windowPromise,
        cartPromise,
        eligibilityPromise,
        coreURLBuilderPromise,
        newSupportTicketLinkPromise,
        trackProjectCreationErrorPromise,
      ]).then(
        ([
          $translate,
          $window,
          cart,
          eligibility,
          coreURLBuilder,
          newSupportTicketLink,
          trackProjectCreationError,
        ]) => {
          let redirectState = 'pci.projects.new.config';
          let redirectParams = transition.params();
          const redirectOptions = {
            location: false,
          };

          let trackErrorMessage;

          if (eligibility.isAskIncreaseProjectsQuotaRequired()) {
            const projectId = get(transition.params('from'), 'projectId');

            redirectState = projectId
              ? 'pci.projects.project.quota-exceed-error'
              : 'pci.projects.quota-exceed-error';
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
              cancelLabel: $translate.instant('pci_project_new_error_cancel'),
            };
            trackErrorMessage =
              'pci_project_new_error_ask_increase_projects_quota';
          } else if (eligibility.isVerifyPaypalRequired()) {
            redirectState = 'pci.error';
            redirectParams = {
              message: $translate.instant(
                'pci_project_new_error_verify_paypal',
                {
                  href: coreURLBuilder.buildURL(
                    'dedicated',
                    '#/billing/payment/method',
                  ),
                },
              ),
              code: ELIGIBILITY_ACTION_ENUM.VERIFY_PAYPAL,
              image: ELIGIBILITY_ERROR_IMAGES_SRC.VERIFY_PAYPAL,
              submitLabel: null,
            };
            trackErrorMessage = 'pci_project_new_error_verify_paypal';
          } else if (cart.cartId !== transition.params().cartId) {
            $window.location.replace(
              transition.router.stateService.href('pci.projects.new', {
                cartId: cart.cartId,
                voucher: redirectParams.voucher,
                context: redirectParams.context,
                target: redirectParams.target,
              }),
            );
            return null;
          }

          if (trackErrorMessage) {
            trackProjectCreationError('config', trackErrorMessage);
          }

          return transition.router.stateService.target(
            redirectState,
            redirectParams,
            redirectOptions,
          );
        },
      );
    },
    views: {
      '@pci': component.name,
    },
    resolve: {
      breadcrumb: () => null,

      newSupportTicketLink: /* @ngInject */ (coreConfig, coreURLBuilder) =>
        coreConfig.isRegion(['EU', 'CA'])
          ? coreURLBuilder.buildURL('dedicated', '#/support/tickets/new')
          : '',

      cart: /* @ngInject */ ($transition$, me, pciProjectNew) => {
        const hasCartId = has($transition$.params(), 'cartId');

        return !hasCartId // just create cart - location will be reloaded to fetch the whole cart
          ? pciProjectNew.createOrderCart(me.ovhSubsidiary)
          : pciProjectNew.getOrderCart(
              me.ovhSubsidiary,
              get($transition$.params(), 'cartId'),
            );
      },

      summary: /* @ngInject */ (
        $q,
        cart,
        voucher,
        getSummary,
        pciProjectNew,
      ) => {
        return $q
          .resolve()
          .then(() => {
            const cartVoucher = get(
              cart,
              'projectItem.voucherConfiguration.value',
            );

            return {
              value: cartVoucher || voucher,
              isInCart: !!cartVoucher,
            };
          })
          .then((voucherInfo) => {
            return voucherInfo.isInCart
              ? pciProjectNew
                  .removeCartProjectItemVoucher(cart)
                  .then(() => voucherInfo)
              : voucherInfo;
          })
          .then((voucherInfo) =>
            getSummary().then((summary) => ({
              summary,
              voucherInfo,
            })),
          )
          .then(({ voucherInfo, summary }) => {
            return voucherInfo.value
              ? pciProjectNew
                  .setCartProjectItemVoucher(cart, voucherInfo.value)
                  .then(() => summary)
              : summary;
          });
      },

      getSummary: /* @ngInject */ (cart, orderCart) => () =>
        orderCart.getSummary(cart.cartId),

      voucher: /* @ngInject */ ($transition$) => {
        return $transition$.params().voucher;
      },

      eligibility: /* @ngInject */ ($transition$, pciProjectNew) =>
        pciProjectNew
          .checkEligibility(get($transition$.params(), 'voucher'))
          .then((eligibility) => new PciEligibility(eligibility)),

      checkVoucherValidity: /* @ngInject */ (pciProjectNew) => (voucher) =>
        pciProjectNew.checkEligibility(voucher).catch((error) => ({
          voucher: {
            error: error.status,
            message: error.data.message,
          },
        })),

      /* ----------  Shared model definition  ---------- */

      model: /* @ngInject */ (
        cart,
        checkVoucherValidity,
        voucher,
        eligibility,
        pciProjectNew,
        ovhPaymentMethodHelper,
      ) => {
        const modelDef = {
          agreements: false,
          credit: null,
          challenge: new PciPaymentMethodChallenge(
            {},
            ovhPaymentMethodHelper.isValidIban,
          ),
          defaultPaymentMethod: null,
          description: get(
            cart,
            'projectItem.descriptionConfiguration.value',
            null,
          ),
          hds: cart.hdsItem !== undefined,
          paymentMethod: null,
          voucher: new PciVoucher({
            value:
              voucher || get(cart, 'projectItem.voucherConfiguration.value'),
          }),
          isVoucherRequirePaymentMethod:
            eligibility.voucher?.paymentMethodRequired,
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
        isVoucherValidating: false,
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
          name: PCI_PROJECT_STEPS.CONFIGURATION,
          active: false,
        },
        {
          name: PCI_PROJECT_STEPS.PAYMENT,
          active: false,
        },
      ],
    },
  });
};
