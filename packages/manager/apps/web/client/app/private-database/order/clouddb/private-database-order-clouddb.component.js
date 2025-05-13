import controller from './private-database-order-clouddb.controller';
import template from './private-database-order-clouddb.html';

export default {
  bindings: {
    cartId: '<',
    catalog: '<',
    datacenter: '<',
    defaultPaymentMean: '<',
    engines: '<',
    ramSizes: '<',
    openBill: '<',
    pricings: '<',
    user: '<',
    dbCategories: '<',
    webCloudCatalog: '<',
    displayErrorMessage: '<',
    displaySuccessMessage: '<',
    onSuccess: '<',
    onError: '<',
  },
  controller,
  name: 'ovhManagerWebPrivateDatabaseOrderCloudDb',
  template,
};
