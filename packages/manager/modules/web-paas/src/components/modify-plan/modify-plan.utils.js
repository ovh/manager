import { buildURL } from '@ovh-ux/ufrontend/url-builder';

export const addProjectResolves = {
  plans: /* @ngInject */ (catalog) => catalog.plans,
  deleteUser: /* @ngInject */ ($state) => (customer) =>
    $state.go('web-paas.add.delete-user', {
      customer,
    }),
  getOrdersURL: /* @ngInject */ () => (orderId) =>
    buildURL('dedicated', '#/billing/orders', {
      status: 'all',
      orderId,
    }),
};

export default {
  addProjectResolves,
};
