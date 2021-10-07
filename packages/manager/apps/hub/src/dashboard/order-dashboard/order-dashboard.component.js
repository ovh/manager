import controller from '../dashboard.controller';
import template from './template.html';

export default {
  bindings: {
    me: '<',
    products: '<',
    tickets: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
