import template from './billing-type.html';

export default {
  bindings: {
    flavor: '<',
    number: '<',
    monthlyBilling: '<',
    description: '@',
  },
  template,
};
