import controller from './choose-payment-type.controller';
import template from './choose-payment-type.html';

export default {
  bindings: {
    allowEdit: '<',
    enterpriseDb: '<',
    paymentTypes: '<',
    user: '<',
    databasePrice: '<',
  },
  controller,
  template,
};
