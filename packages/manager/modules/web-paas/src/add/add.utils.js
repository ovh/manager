export const commonResolves = {
  plans: /* @ngInject */ (catalog) => catalog.plans,
  deleteUser: /* @ngInject */ ($state) => (customer) =>
    $state.go('web-paas.add.delete-user', {
      customer,
    }),
  getOrdersURL: /* @ngInject */ (coreURLBuilder) => (orderId) =>
    coreURLBuilder.buildURL('dedicated', '#/billing/orders/:orderId', {
      orderId,
    }),
};

export default {
  commonResolves,
};
