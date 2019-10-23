import controller from './order-contracts.controller';
import template from './order-contracts.html';

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
