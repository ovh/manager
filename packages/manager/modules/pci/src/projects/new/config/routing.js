import component from './component';
import { PCI_PROJECT_ORDER_CART } from '../constants';
import { PCI_HDS_ADDON } from '../../project/project.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new.config', {
    url: '/config',
    views: {
      '': component.name,

      'banner@pci.projects.new.config': {
        componentProvider: /* @ngInject */ (ovhPciFeatureFlipping) =>
          ovhPciFeatureFlipping.isFeatureActive('pci.onboarding.new.banner')
            ? 'pciProjectNewConfigBanner'
            : null,
      },

      'progress@pci.projects.new.config': 'pciProjectNewProgress',

      'voucher@pci.projects.new.config': 'pciProjectNewVoucher',
    },
    onEnter: /* @ngInject */ (activeStep, step) => {
      activeStep(step.name);
    },
    resolve: {
      getActionHref: /* @ngInject */ ($state) => (action) => {
        const actionState =
          action === 'cancel' ? 'pci.projects' : 'pci.projects.new.payment';

        return $state.href(actionState);
      },

      goToPayment: /* @ngInject */ ($state, cart) => () =>
        $state.go('pci.projects.new.payment', {
          cartId: cart.cartId,
        }),

      hds: /* @ngInject */ (
        hdsAddonOption,
        isHdsAvailable,
        isValidHdsSupportLevel,
      ) => {
        return {
          isAvailable: isHdsAvailable,
          isCertifiedProject: false,
          isValidForCertification: true,
          isValidSupportLevel: isValidHdsSupportLevel,
          isInprogressRequest: false,
          option: hdsAddonOption,
        };
      },

      hdsAddonOption: /* @ngInject */ (OrderCartService, cart) =>
        OrderCartService.getProductOptions(
          cart.cartId,
          PCI_PROJECT_ORDER_CART.productName,
          PCI_PROJECT_ORDER_CART.planCode,
        ).then((addons) =>
          addons.find((addon) => addon.planCode === PCI_HDS_ADDON.planCode),
        ),

      step: /* @ngInject */ (getStep) => getStep('configuration'),

      summary: /* @ngInject */ (getSummary) => getSummary(),

      getSummary: /* @ngInject */ (cart, OrderCartService) => () =>
        OrderCartService.getSummary(cart.cartId),

      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
    },
  });
};
