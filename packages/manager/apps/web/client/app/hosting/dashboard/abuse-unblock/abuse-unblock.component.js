import template from './abuse-unblock.html';
import controller from './abuse-unblock.controller';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    setMessage: '<',
  },
  template,
  controller,
};
