import controller from './price.controller';
import template from './price.html';

const component = {
  bindings: {
    price: '<',
    tax: '<',
    user: '<',
    hideTax: '<',
  },
  controller,
  template,
};

export default component;
