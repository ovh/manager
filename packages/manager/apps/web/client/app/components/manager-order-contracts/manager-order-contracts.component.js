import controller from './manager-order-contracts.controller';
import template from './manager-order-contracts.html';

const component = {
  bindings: {
    name: '@',
    items: '<',
    model: '=',
  },
  controller,
  template,
};

export default component;
