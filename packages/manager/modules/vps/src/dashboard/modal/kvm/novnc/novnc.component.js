import controller from './novnc.controller';
import template from './novnc.html';

export default {
  controller,
  template,
  bindings: {
    host: '<',
    port: '<',
    password: '<',
  },
};
