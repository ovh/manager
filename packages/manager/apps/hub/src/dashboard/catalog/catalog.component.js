import controller from './catalog.controller';
import template from './template.html';

export default {
  bindings: {
    products: '<',
    categories: '<',
    universes: '<',
  },
  controller,
  template,
};
