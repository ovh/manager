import controller from './traffic.controller';
import template from './traffic.html';

export default {
  bindings: {
    ip: '<',
    dateTime: '<',
  },
  controller,
  template,
};
