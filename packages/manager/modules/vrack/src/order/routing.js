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
    },
  });
};
