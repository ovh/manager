export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack.order', {
    url: '/order',
    component: 'vrackOrderComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vrack_order_title'),
      goBack: /* @ngInject */ ($state) => (reload) =>
        $state.go('vrack.index', {}, { reload }),
      cart: /* @ngInject */ (VrackOrderService) =>
        VrackOrderService.createCartWithOneVrack().then(({ data }) => data),
      vrackContracts: /* @ngInject */ (cart, VrackOrderService) =>
        VrackOrderService.getContracts(cart.cartId),
      isVrackOrderAutoPayAvailable: /* @ngInject */ (ovhFeatureFlipping) => {
        const vrackOrderAutoPayFeatureId =
          'vrack:order:autoPayWithPreferredPaymentMethod';
        return ovhFeatureFlipping
          .checkFeatureAvailability(vrackOrderAutoPayFeatureId)
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(vrackOrderAutoPayFeatureId),
          )
          .catch(() => false);
      },
    },
  });
};
