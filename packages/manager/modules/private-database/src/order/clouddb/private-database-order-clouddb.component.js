import controller from './private-database-order-clouddb.controller';
import template from './private-database-order-clouddb.html';

export default {
  bindings: {
    cartId: '<',
    catalog: '<',
    datacenters: '<',
    defaultPaymentMean: '<',
    engines: '<',
    ramSizes: '<',
    openBill: '<',
    pricings: '<',
    user: '<',

    displayErrorMessage: '<',
    displaySuccessMessage: '<',
  },
  controller,
  name: 'ovhManagerWebPrivateDatabaseOrderCloudDb',
  template,
};
