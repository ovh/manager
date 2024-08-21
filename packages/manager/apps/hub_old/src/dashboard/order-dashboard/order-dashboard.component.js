import controller from '../dashboard.controller';
import template from './template.html';

export default {
  bindings: {
    me: '<',
    catalogItems: '<',
    tickets: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
