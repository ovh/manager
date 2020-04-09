import controller from './antihack.controller';
import template from './antihack.html';

export default {
  bindings: {
    goBack: '<',
    ip: '<',
    ipBlock: '<',
  },
  controller,
  template,
};
