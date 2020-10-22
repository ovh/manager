import component from './component';

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
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('summary')
        .then(() => false)
        .catch(() => 'pci.projects'),
    resolve: {
      getActionHref: /* @ngInject */ ($state) => (action) => {
        const actionState =
          action === 'cancel' ? 'pci.projects' : 'pci.projects.new.payment';

        return $state.href(actionState);
      },

      summary: /* @ngInject */ (cart, orderCart) =>
        orderCart.getSummary(cart.cartId),

      goToPayment: /* @ngInject */ ($state, cart) => () =>
        $state.go('pci.projects.new.payment', {
          cartId: cart.cartId,
        }),

      step: /* @ngInject */ (getStep) => getStep('configuration'),
    },
  });
};
