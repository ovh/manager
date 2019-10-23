import controller from './manager-order-catalog-price.controller';
import template from './manager-order-catalog-price.html';

const component = {
  bindings: {
    block: '<',
    price: '<',
    tax: '<',
    user: '<',
  },
  controller,
  template,
};

export default component;
