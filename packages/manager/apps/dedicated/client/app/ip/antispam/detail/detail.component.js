import controller from './detail.controller';
import template from './detail.html';

export default {
  bindings: {
    block: '<',
    goBack: '<',
    ip: '<',
    timestamp: '<',
  },
  controller,
  template,
};
